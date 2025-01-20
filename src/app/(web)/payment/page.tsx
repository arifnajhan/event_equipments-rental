// app/(web)/payment/page.tsx
'use client';

import { updateBookingStatus } from '@/libs/apis';
import dayjs from 'dayjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCreditCard, FaWhatsapp } from 'react-icons/fa';

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'whatsapp' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = searchParams.get('amount') || '0';
  const equipmentName = searchParams.get('equipment') || '';
  const rentDateRaw = searchParams.get('rentDate') || '';
  const returnDateRaw = searchParams.get('returnDate') || '';
  const userId = searchParams.get('userId') || '';
  const bookingId = searchParams.get('bookingId') || '';
  const isBatchPayment = searchParams.get('isBatchPayment') === 'true';
  const bookingIds = searchParams.get('bookingIds')?.split(',') || [];

  const rentDate = rentDateRaw ? dayjs(rentDateRaw).format('DD/MM/YY') : '';
  const returnDate = returnDateRaw ? dayjs(returnDateRaw).format('DD/MM/YY') : '';
  

  const handleCardPayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isBatchPayment) {
        // Update status for all bookings in the batch
        await Promise.all(bookingIds.map(id => updateBookingStatus(id, 'confirmed')));
      } else {
        // Update single booking
        await updateBookingStatus(bookingId, 'confirmed');
      }
      
      toast.success('Payment successful!');
      router.push(`/users/${userId}?success=true`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppPayment = () => {
    const message = encodeURIComponent(
      `Hello! I would like to make a payment for:\n` +
      `Equipment: ${equipmentName}\n` +
      (isBatchPayment ? 
        `Multiple items - Batch Payment\n` :
        `Rent Date: ${rentDate}\nReturn Date: ${returnDate}\n`) +
      `Amount: RM ${amount}`
    );
    const phoneNumber = '60194070059';
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isBatchPayment ? 'Batch Payment' : 'Payment Details'}
        </h2>
        
        {/* Booking Summary */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-black">Booking Summary</h3>
          <div className="space-y-2 text-black">
            <p>Equipment: {equipmentName}</p>
            {!isBatchPayment && (
              <>
                <p>Rent Date: {rentDate}</p>
                <p>Return Date: {returnDate}</p>
              </>
            )}
            <p className="text-xl font-bold mt-4">Total: RM {parseFloat(amount).toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-black">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all
                ${paymentMethod === 'card' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-200 hover:border-primary/50'}`}
            >
              <FaCreditCard size={24} className="text-black" />
              <span className="text-black">Credit Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('whatsapp')}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all
                ${paymentMethod === 'whatsapp' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-200 hover:border-primary/50'}`}
            >
              <FaWhatsapp size={24} className="text-black" />
              <span className="text-black">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-black">Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary text-black"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary text-black"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary text-black"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {paymentMethod && (
          <button
            onClick={paymentMethod === 'card' ? handleCardPayment : handleWhatsAppPayment}
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : paymentMethod === 'card' ? 'Pay Now' : 'Continue to WhatsApp'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
