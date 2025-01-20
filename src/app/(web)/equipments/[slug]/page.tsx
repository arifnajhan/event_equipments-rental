'use client';

import React, { useState, useEffect } from 'react';
import { getEquipment, getBooking, updateBooking } from '@/libs/apis';
import useSWR from 'swr';
import LoadingSpinner from '../../loading';
import EventPhotoGallery from '@/components/EventPhotoGallery/EventPhotoGallery';
import BookEquipmentCta from '@/components/BookEquipmentCta/BookEquipmentCta';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Booking } from '@/models/booking';

const EquipmentDetails = ({ params }: { params: { slug: string } }) => {
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { data: session } = useSession();
  
  const [rentDate, setRentDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [existingBooking, setExistingBooking] = useState<Booking | null>(null);

  const fetchEquipment = async () => getEquipment(slug);
  const { data: equipment, error, isLoading } = useSWR('/api/equipment', fetchEquipment);

  useEffect(() => {
    const fetchBooking = async () => {
      if (bookingId) {
        try {
          const booking = await getBooking(bookingId);
          setExistingBooking(booking);
          setRentDate(new Date(booking.rentDate));
          setReturnDate(new Date(booking.returnDate));
        } catch (error) {
          console.error('Error fetching booking:', error);
          toast.error('Error fetching booking details');
        }
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (error) throw new Error('Cannot fetch data');
  if (typeof equipment === 'undefined' && !isLoading) throw new Error('Cannot fetch data');
  if (!equipment) return <LoadingSpinner />;

  const calcMinReturnDate = (): Date | undefined => {
    if (!rentDate) return undefined;
    const nextDay = new Date(rentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const calcNumDays = () => {
    if (!rentDate || !returnDate) return 0;
    const timeDiff = returnDate.getTime() - rentDate.getTime();
    const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    return noOfDays;
  };

  const handleBookNowClick = async () => {
    if (!session) {
      toast.error('Please sign in to book equipment');
      return;
    }

    if (!rentDate || !returnDate) {
      toast.error('Please provide rent / return date');
      return;
    }

    if (rentDate > returnDate) {
      toast.error('Please choose a valid rent period');
      return;
    }

    const numberOfDays = calcNumDays();
    const totalAmount = numberOfDays * equipment.price;

    if (existingBooking) {
      // Update existing booking
      try {
        await updateBooking({
          bookingId: existingBooking._id,
          rentDate: rentDate.toISOString().split('T')[0],
          returnDate: returnDate.toISOString().split('T')[0],
          numberOfDays,
          totalPrice: totalAmount,
        });
        toast.success('Booking updated successfully');
        router.push('/bookings');
      } catch (error) {
        console.error('Error updating booking:', error);
        toast.error('Error updating booking');
      }
    } else {
      // Create new booking
      const searchParams = new URLSearchParams({
        amount: totalAmount.toString(),
        equipment: equipment.name,
        rentDate: rentDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        userId: session.user?.id || 'guest',
        equipmentSlug: equipment.slug.current
      });
      router.push(`/payment?${searchParams.toString()}`);
    }
  };

  return (
    <div>
      <EventPhotoGallery photos={equipment.images} />

      <div className="container mx-auto mt-20">
        <div className="md:grid md:grid-cols-12 gap-10 px-3">
          <div className="md:col-span-8 md:w-full">
            <div>
              <h2 className="font-bold text-left text-lg md:text-2xl">
                {equipment.name}
              </h2>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Description</h2>
                <p>{equipment.description}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
            <BookEquipmentCta
              price={equipment.price}
              specialNote={equipment.specialNote}
              rentDate={rentDate}
              setRentDate={setRentDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              calcMinReturnDate={calcMinReturnDate}
              isBooked={equipment.isBooked && !existingBooking}
              handleBookNowClick={handleBookNowClick}
              existingBooking={existingBooking || undefined}
              equipmentId={equipment._id} // Add this
              calcNumDays={calcNumDays} // Add this
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;