'use client';

import { FC, Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Booking } from "@/models/booking";
import { FaBookmark } from 'react-icons/fa'; // Import bookmark icon
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { addToMyBookings } from "@/libs/apis";

type Props = {
  rentDate: Date | null;
  setRentDate: Dispatch<SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: Dispatch<SetStateAction<Date | null>>;
  calcMinReturnDate: () => Date | undefined;
  price: number;
  specialNote: string;
  isBooked: boolean;
  handleBookNowClick: () => void;
  existingBooking?: Booking;
  equipmentId: string;
  calcNumDays: () => number;
};

const BookEquipmentCta: FC<Props> = ({
  price,
  specialNote,
  rentDate,
  setRentDate,
  returnDate,
  setReturnDate,
  calcMinReturnDate,
  isBooked,
  handleBookNowClick,
  existingBooking,
  equipmentId,
  calcNumDays,
}) => {
  const { data: session } = useSession();
  

  const handleAddToMyBookings = async () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to add to My Bookings');
      return;
    }

    if (!rentDate || !returnDate) {
      toast.error('Please select both rent and return dates');
      return;
    }

    try {
      await addToMyBookings({
        userId: session.user.id,
        equipmentId,
        rentDate: rentDate.toISOString().split('T')[0],
        returnDate: returnDate.toISOString().split('T')[0],
        numberOfDays: calcNumDays(),
        totalPrice: calcNumDays() * price,
      });

      toast.success('Added to My Bookings');
    } catch (error) {
      console.error('Error adding to My Bookings:', error);
      toast.error('Failed to add to My Bookings');
    }
  };

  return (
    <div className='px-7 py-6'>
      <h3 className='font-bold text-xl'>
        RM {price}
      </h3>
      <div className='w-full border-b-2 border-b-secondary my-2'>
        <h4 className='my-8'>{specialNote}</h4>
        <div className='flex'>
          <div className='w-1/2 pr-2'>
            <label 
              htmlFor='rent-date'
              className='block text-sm font-medium text-gray-900'
            >
              Rent Date
            </label>
            <DatePicker 
              selected={rentDate}
              onChange={date => setRentDate(date)}
              dateFormat='dd/MM/yyyy'
              minDate={existingBooking ? undefined : new Date()}
              id='rent-date'
              className='w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary'
            />
          </div>
          <div className='w-1/2 pl-2'>
            <label 
              htmlFor='return-date'
              className='block text-sm font-medium text-gray-900'
            >
              Return Date
            </label>
            <DatePicker
              selected={returnDate}
              onChange={date => setReturnDate(date)}
              dateFormat='dd/MM/yyyy'
              disabled={!rentDate}
              minDate={calcMinReturnDate()}
              id='return-date'
              className='w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary'
            />
          </div>
        </div>
        {calcNumDays() > 0 && (
          <p className='mt-3'>Total Price: RM {calcNumDays() * price}</p>
        )}
      </div>
      <div className='space-y-3'>
        <button
          onClick={handleBookNowClick}
          disabled={!rentDate || !returnDate}
          className='w-full bg-primary text-white py-2 rounded-lg mt-6 hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed'
        >
          {existingBooking ? 'Update Booking' : isBooked ? 'Equipment Not Available' : 'Book Now'}
        </button>
        
        <button
          onClick={handleAddToMyBookings}
          disabled={!rentDate || !returnDate}
          className='w-full border border-primary text-primary py-2 rounded-lg hover:bg-primary/10 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          <FaBookmark className="w-4 h-4" />
          Add to MyBookings
        </button>
      </div>
    </div>
  );
};

export default BookEquipmentCta;