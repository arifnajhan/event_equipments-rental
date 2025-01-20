// app/(web)/users/[id]/bookings/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Booking } from '@/models/booking';

const UserBookingsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${session.user.id}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.id]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Error cancelling booking');
    }
  };

  const handleUpdateBooking = (booking: Booking) => {
    router.push(`/equipments/${booking.eventEquipments.slug.current}?bookingId=${booking._id}`);
  };

  const handlePayment = (booking: Booking) => {
    router.push(
      `/payment?` + 
      `amount=${booking.totalPrice}&` +
      `equipment=${booking.eventEquipments.name}&` +
      `rentDate=${booking.rentDate}&` +
      `returnDate=${booking.returnDate}&` +
      `userId=${session?.user?.id}&` +
      `bookingId=${booking._id}`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button
            onClick={() => router.push('/equipments')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Browse Equipment
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.eventEquipments.name}
                  </h3>
                  <p className="text-gray-600">
                    {dayjs(booking.rentDate).format('DD/MM/YYYY')} - {' '}
                    {dayjs(booking.returnDate).format('DD/MM/YYYY')}
                  </p>
                  <p className="mt-2">
                    Duration: {booking.numberOfDays} days
                  </p>
                  <p className="text-lg font-semibold mt-2">
                    Total: RM {booking.totalPrice}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {booking.status === 'pending' && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handlePayment(booking)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => handleUpdateBooking(booking)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;