'use client';

import { Booking } from "@/models/booking";
import { useRouter } from "next/navigation";
import BookingActions from '@/components/BookingActions/BookingActions';  // Updated import

type Props = {
    bookingDetails: Booking[];
    onBookingUpdated?: () => void;
    userId: string;
};

const MyBookings = ({ bookingDetails, onBookingUpdated }: Props) => {
    const router = useRouter();

    if (!bookingDetails?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-xl text-gray-600 mb-4">No bookings found</p>
                <button
                    onClick={() => router.push('/equipments')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Browse Available Equipment
                </button>
            </div>
        );
    }

    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className="text-3xl font-bold mb-6">My Booked Equipment</h1>
            <div className='overflow-x-auto rounded-lg shadow-md'>
                <table className='w-full text-sm text-left'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        <tr>
                            {['Equipment name', 'Rent Date', 'Return Date', 'Unit Price', 'Total Price', 'Status', 'Actions']
                                .map(header => (
                                    <th key={header} className='px-6 py-3'>{header}</th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bookingDetails.map(booking => (
                            <tr key={booking._id} className='bg-white border-b hover:bg-gray-50'>
                                <td className='px-6 py-4 font-medium'>
                                    {booking.eventEquipments.name}
                                </td>
                                <td className='px-6 py-4'>
                                    {new Date(booking.rentDate).toLocaleDateString()}
                                </td>
                                <td className='px-6 py-4'>
                                    {new Date(booking.returnDate).toLocaleDateString()}
                                </td>
                                <td className='px-6 py-4'>
                                    RM {booking.eventEquipments.price.toFixed(2)}
                                </td>
                                <td className='px-6 py-4'>
                                    RM {booking.totalPrice.toFixed(2)}
                                </td>
                                <td className='px-6 py-4'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${statusStyles[booking.status as keyof typeof statusStyles] || statusStyles.pending}`}>
                                        {booking.status || 'pending'}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>
                                    <BookingActions 
                                        booking={booking}
                                        onBookingUpdated={onBookingUpdated}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookings;