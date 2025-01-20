import { authenticateRequest } from '@/libs/authUtils';
import sanityClient from '@/libs/sanity';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const auth = await authenticateRequest();
        if (auth.error) return auth.error;

        const session = auth.session;
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { bookingId, status } = await req.json();

        if (!bookingId || !status) {
            return NextResponse.json(
                { message: 'Booking ID and status are required' },
                { status: 400 }
            );
        }

        // Verify the booking exists and belongs to the user
        const booking = await sanityClient.fetch(
            `*[_type == "booking" && _id == $bookingId][0]{
                user->{_id}
            }`,
            { bookingId }
        );

        if (!booking || booking.user._id !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Update the booking status
        const updatedBooking = await sanityClient
            .patch(bookingId)
            .set({ status })
            .commit();

        return NextResponse.json(updatedBooking);
    } catch (error: any) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating booking status' },
            { status: 500 }
        );
    }
}