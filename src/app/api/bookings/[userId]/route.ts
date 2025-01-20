import { authenticateRequest } from '@/libs/authUtils';
import sanityClient from '@/libs/sanity';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    req: NextRequest
) {
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

        // Get userId from URL
        const urlParts = req.nextUrl.pathname.split('/');
        const userId = urlParts[urlParts.length - 2];

        // Get bookingId from query params
        const searchParams = req.nextUrl.searchParams;
        const bookingId = searchParams.get('bookingId');

        if (!bookingId) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Fetch the booking to verify ownership
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

        const body = await req.json();
        
        const updatedBooking = await sanityClient
            .patch(bookingId)
            .set({
                rentDate: body.rentDate,
                returnDate: body.returnDate,
                numberOfDays: body.numberOfDays,
                totalPrice: body.totalPrice,
                status: body.status
            })
            .commit();

        return NextResponse.json(updatedBooking);
    } catch (error: any) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { message: error.message || 'Error updating booking' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest
) {
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

        // Get userId from URL
        const urlParts = req.nextUrl.pathname.split('/');
        const userId = urlParts[urlParts.length - 2];

        // Get bookingId from query params
        const searchParams = req.nextUrl.searchParams;
        const bookingId = searchParams.get('bookingId');

        if (!bookingId) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Fetch the booking to verify ownership
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

        // Delete the booking
        await sanityClient.delete(bookingId);

        return NextResponse.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting booking:', error);
        return NextResponse.json(
            { message: error.message || 'Error deleting booking' },
            { status: 500 }
        );
    }
}
