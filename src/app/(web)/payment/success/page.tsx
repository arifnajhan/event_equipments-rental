'use client';

import { updateBooking, updatePaymentStatus } from "@/libs/apis";
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
    const router = useRouter();

    const handlePaymentSuccess = async (bookingId: string, paymentId: string, paymentDetails: any) => {
        try {
            // Update payment status
            await updatePaymentStatus(paymentId, 'completed', paymentDetails);
            
            // Update booking status to confirmed
            await updateBooking({
                bookingId,
                status: 'confirmed'
            });
            
            toast.success('Payment successful! Booking confirmed.');
            router.push('/bookings');
        } catch (error) {
            toast.error('Error confirming booking after payment');
            console.error('Error:', error);
        }
    };

    return (
        // Add your payment success page UI here
        <div>Payment Success Page</div>
    );
};

export default PaymentSuccessPage;