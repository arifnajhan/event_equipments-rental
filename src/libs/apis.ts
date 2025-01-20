import axios from 'axios';
import { CreateBookingDto, Equipment } from "@/models/equipments";
import sanityClient from "./sanity";
import * as queries from "./sanityQueries";
import { Booking } from '@/models/booking';

// Equipment-related functions (keeping existing ones)
export async function getFeaturedEquipments() {
    const result = await sanityClient.fetch<Equipment>(
        queries.getFeaturedEquipmentsQuery,
        {},
        { cache: 'no-cache' }
    );
    return result;
}

export async function getEquipments() {
    const result = await sanityClient.fetch<Equipment[]>(
        queries.getEquipmentsQuery,
        {},
        { cache: 'no-cache' }
    );
    return result;
}

export async function getEquipment(slug: string) {
    const result = await sanityClient.fetch<Equipment>(
        queries.getEquipment,
        { slug },
        { cache: 'no-cache' }
    );
    return result;
}

// User-related functions
export async function getUserData(userId: string) {
    const result = await sanityClient.fetch(
        queries.getUserDataQuery,
        { userId },
        { cache: 'no-cache' }
    );
    return result;
}

// Booking-related functions
export async function getUserBookings(userId: string) {
    const result = await sanityClient.fetch<Booking[]>(
        queries.getUserBookingsQuery,
        { userId },
        { cache: 'no-cache' }
    );
    return result;
}

export async function getBooking(bookingId: string) {
    const result = await sanityClient.fetch<Booking>(
        queries.getBookingQuery,
        { bookingId },
        { cache: 'no-cache' }
    );
    return result;
}

export const createBooking = async ({
    rentDate,
    returnDate,
    eventEquipments,
    numberOfDays,
    totalPrice,
    user,
}: CreateBookingDto) => {
    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'booking',
                    user: { _type: 'reference', _ref: user },
                    eventEquipments: { _type: 'reference', _ref: eventEquipments },
                    rentDate,
                    returnDate,
                    numberOfDays,
                    totalPrice,
                    status: 'pending', // Adding default status
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
    return data;
};

export const updateBooking = async ({
    bookingId,
    rentDate,
    returnDate,
    numberOfDays,
    totalPrice,
    status,
}: {
  bookingId: string;
    rentDate?: string;
    returnDate?: string;
    numberOfDays?: number;
    totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
}) => {
    const updates: any = {};
    
    if (rentDate) updates.rentDate = rentDate;
    if (returnDate) updates.returnDate = returnDate;
    if (numberOfDays !== undefined) updates.numberOfDays = numberOfDays;
    if (totalPrice !== undefined) updates.totalPrice = totalPrice;
    if (status) updates.status = status;

    const mutation = {
        mutations: [
            {
                patch: {
                    id: bookingId,
                    set: updates,
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );

    return data;
};

// New function to update booking status
export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    return updateBooking({ bookingId, status });
};

// Updated deleteBooking to change status instead of deleting
export const deleteBooking = async (bookingId: string) => {
    try {
        const { data } = await axios.post(
            `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
            {
                mutations: [
                    {
                        delete: {
                            id: bookingId
                        }
                    }
                ]
            },
            { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
        );
        return data;
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};

// Function to handle booking payment
export const processBookingPayment = async (bookingId: string) => {
    try {
        // Update booking status to confirmed after successful payment
        const result = await updateBookingStatus(bookingId, 'confirmed');
        return result;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('Payment processing failed');
    }
};

// API route handlers for frontend
export const updateBookingViaApi = async (bookingId: string, updates: Partial<Booking>) => {
    try {
        // Use the existing userId route with bookingId as query param
        const response = await fetch(`/api/bookings/${updates.user?._id}?bookingId=${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update booking');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
};

export const cancelBookingViaApi = async (userId: string, bookingId: string) => {
    try {
        const response = await fetch(`/api/bookings/${userId}/${bookingId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        return await response.json();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};

// Helper function to check if a booking can be edited
export const canEditBooking = (booking: Booking): boolean => {
    return booking.status === 'pending';
};

// Helper function to check if a booking can be cancelled
export const canCancelBooking = (booking: Booking): boolean => {
    return booking.status === 'pending';
};

// Helper function to check if a booking requires payment
export const requiresPayment = (booking: Booking): boolean => {
    return booking.status === 'pending';
};

import { Payment } from '@/models/payment'; 

export const createPayment = async ({
    amount,
    userId,
    bookingId,
    paymentMethod,
}: {
    amount: number;
    userId: string;
    bookingId: string;
    paymentMethod: 'card' | 'whatsapp';
}) => {
    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'payment',
                    amount,
                    user: { _type: 'reference', _ref: userId },
                    booking: { _type: 'reference', _ref: bookingId },
                    paymentMethod,
                    paymentStatus: 'pending',
                    transactionDate: new Date().toISOString(),
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
    return data;
};

export const updatePaymentStatus = async (
    paymentId: string,
    paymentStatus: 'pending' | 'completed' | 'failed',
    paymentDetails?: {
        cardLast4?: string;
        whatsappNumber?: string;
    }
) => {
    const mutation = {
        mutations: [
            {
                patch: {
                    id: paymentId,
                    set: {
                        paymentStatus,
                        ...(paymentDetails && { paymentDetails }),
                    },
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
    return data;
};

export const getPayment = async (paymentId: string) => {
    const result = await sanityClient.fetch(
        queries.getPaymentQuery,
        { paymentId },
        { cache: 'no-cache' }
    );
    return result;
};

export const getUserPayments = async (userId: string) => {
    const result = await sanityClient.fetch<Payment[]>(
        queries.getUserPaymentsQuery,
        { userId },
        { cache: 'no-cache' }
    );
    return result;
};

export const getBookingPayment = async (bookingId: string) => {
    const result = await sanityClient.fetch(
        queries.getBookingPaymentQuery,
        { bookingId },
        { cache: 'no-cache' }
    );
    return result;
};

export const addToMyBookings = async (bookingData: {
    userId: string;
    equipmentId: string;
    rentDate: string;
    returnDate: string;
    numberOfDays: number;
    totalPrice: number;
  }) => {
    const response = await fetch('/api/bookings/temporary', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to add to my bookings');
    }
  
    return response.json();
  };

  
