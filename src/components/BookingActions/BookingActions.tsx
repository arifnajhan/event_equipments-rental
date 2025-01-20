'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Booking } from '@/models/booking';
import { updateBookingViaApi } from '@/libs/apis';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BookingActionsProps {
    booking: Booking;
    onBookingUpdated?: () => void;
}

const BookingActions = ({ booking, onBookingUpdated }: BookingActionsProps) => {
    const router = useRouter();
    const [processingBookings, setProcessingBookings] = useState<Set<string>>(new Set());
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rentDate, setRentDate] = useState<Date | null>(new Date(booking.rentDate));
    const [returnDate, setReturnDate] = useState<Date | null>(new Date(booking.returnDate));
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async (bookingId: string) => {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        if (!booking?._id) {
            toast.error('Invalid booking information');
            return;
        }
    
        try {
            setProcessingBookings(prev => new Set(prev).add(bookingId));
            
            // Make the API call without depending on booking.user._id
            const response = await fetch(`/api/bookings/current?bookingId=${bookingId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete booking');
            }
    
            toast.success('Booking deleted successfully');
            onBookingUpdated?.();
            router.refresh();
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete booking');
        } finally {
            setProcessingBookings(prev => {
                const updated = new Set(prev);
                updated.delete(bookingId);
                return updated;
            });
        }
    };

    const handlePayment = (booking: Booking) => {
        if (!booking?.eventEquipments?.name || !booking._id) {
            toast.error('Invalid booking information');
            return;
        }

        const params = new URLSearchParams({
            amount: booking.totalPrice.toString(),
            equipment: booking.eventEquipments.name,
            rentDate: booking.rentDate,
            returnDate: booking.returnDate,
            bookingId: booking._id
        });
        router.push(`/payment?${params.toString()}`);
    };

    const handleUpdateBooking = async () => {
        if (!rentDate || !returnDate) {
            toast.error('Please select both dates');
            return;
        }

        if (!booking?.eventEquipments?.price) {
            toast.error('Invalid booking information');
            return;
        }
    
        setIsUpdating(true);
        try {
            const numberOfDays = Math.ceil(
                (returnDate.getTime() - rentDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = numberOfDays * booking.eventEquipments.price;
    
            await updateBookingViaApi(booking._id, {
                rentDate: rentDate.toISOString().split('T')[0],
                returnDate: returnDate.toISOString().split('T')[0],
                numberOfDays,
                totalPrice,
                status: 'pending'
            });
    
            toast.success('Booking updated successfully');
            setIsEditModalOpen(false);
            onBookingUpdated?.();
            router.refresh();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking');
        } finally {
            setIsUpdating(false);
        }
    };

    const calcMinReturnDate = () => {
        if (!rentDate) return undefined;
        const minDate = new Date(rentDate);
        minDate.setDate(minDate.getDate() + 1);
        return minDate;
    };

    const handleRentDateChange = (date: Date | null) => {
        setRentDate(date);
        if (date && returnDate && date >= returnDate) {
            setReturnDate(null);
        }
    };

    const handleReturnDateChange = (date: Date | null) => {
        setReturnDate(date);
    };

    if (booking.status === 'confirmed') {
        return <span className="text-green-500">Booking Confirmed</span>;
    }

    return (
        <>
            <div className="flex space-x-3">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(booking._id)}
                    disabled={processingBookings.has(booking._id)}
                    className="text-red-600 hover:text-red-800 font-medium
                    disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {processingBookings.has(booking._id) ? 'Deleting...' : 'Delete'}
                </button>
                <button
                    onClick={() => handlePayment(booking)}
                    className="text-green-600 hover:text-green-800 font-medium"
                >
                    Pay Now
                </button>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Update Booking</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rent Date
                                </label>
                                <DatePicker
                                    selected={rentDate}
                                    onChange={handleRentDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Return Date
                                </label>
                                <DatePicker
                                    selected={returnDate}
                                    onChange={handleReturnDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={calcMinReturnDate()}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            {rentDate && returnDate && booking?.eventEquipments?.price && (
                                <div className="text-sm text-gray-600">
                                    Total Price: RM {
                                        (Math.ceil((returnDate.getTime() - rentDate.getTime()) / (1000 * 60 * 60 * 24)) * 
                                        booking.eventEquipments.price).toFixed(2)
                                    }
                                </div>
                            )}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateBooking}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingActions;