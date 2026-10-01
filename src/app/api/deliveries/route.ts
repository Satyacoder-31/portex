import { NextResponse } from 'next/server';
import { INITIAL_DELIVERIES } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INITIAL_DELIVERIES.length,
    deliveries: INITIAL_DELIVERIES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trackingNumber = `PRTX-${Math.floor(10000 + Math.random() * 90000)}-LKO`;

    const newBooking = {
      id: `del-${Date.now()}`,
      trackingNumber,
      status: 'BOOKING_CREATED',
      createdAt: 'Just now',
      ...body,
    };

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
