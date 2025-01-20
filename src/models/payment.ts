// models/payment.ts

export type Payment = {
    _id: string;
    amount: number;
    paymentMethod: 'card' | 'whatsapp';
    paymentStatus: 'pending' | 'completed' | 'failed';
    transactionDate: string;
    paymentDetails?: {
        cardLast4?: string;
        whatsappNumber?: string;
    };
    user: {
        _id: string;
        name: string;
        email: string;
    };
    booking: {
        _id: string;
        rentDate: string;
        returnDate: string;
        totalPrice: number;
        status: 'pending' | 'confirmed' | 'cancelled';
        eventEquipments?: {
            name: string;
            slug: { current: string };
        };
    };
};

export type CreatePaymentDto = {
    amount: number;
    userId: string;
    bookingId: string;
    paymentMethod: 'card' | 'whatsapp';
};