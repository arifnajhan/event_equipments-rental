import { NextResponse } from 'next/server';
import sanityClient from '@/libs/sanity';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, equipmentId, rentDate, returnDate, numberOfDays, totalPrice } = body;

    const booking = await sanityClient.create({
      _type: 'booking',
      user: {
        _type: 'reference',
        _ref: userId,
      },
      eventEquipments: {
        _type: 'reference',
        _ref: equipmentId,
      },
      rentDate,
      returnDate,
      numberOfDays,
      totalPrice,
      status: 'pending',
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating temporary booking:', error);
    return NextResponse.json(
      { error: 'Failed to create temporary booking' },
      { status: 500 }
    );
  }
}