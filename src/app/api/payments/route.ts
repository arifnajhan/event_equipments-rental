// app/api/payments/route.ts

import { createPayment } from '@/libs/apis';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createPayment(body);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
}

// app/api/payments/[paymentId]/route.ts

import { NextResponse } from 'next/server';
import { updatePaymentStatus, getPayment } from '@/libs/apis';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const paymentId = url.pathname.split('/').pop();

        if (!paymentId) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        const payment = await getPayment(paymentId);
        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch payment' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const paymentId = url.pathname.split('/').pop();

        if (!paymentId) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { paymentStatus, paymentDetails } = body;
        const result = await updatePaymentStatus(
            paymentId,
            paymentStatus,
            paymentDetails
        );
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update payment' },
            { status: 500 }
        );
    }
}
