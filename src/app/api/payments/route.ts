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

export async function GET(
    request: Request,
    { params }: { params: { paymentId: string } }
) {
    try {
        const payment = await getPayment(params.paymentId);
        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch payment' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { paymentId: string } }
) {
    try {
        const body = await request.json();
        const { paymentStatus, paymentDetails } = body;
        const result = await updatePaymentStatus(
            params.paymentId,
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