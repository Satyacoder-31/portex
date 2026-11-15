import { NextResponse } from 'next/server';
import {
  getServerDeliveries,
  saveServerDelivery,
  updateServerDelivery,
} from '@/lib/server/dataStore';
import { DeliveryBooking } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deliveries = getServerDeliveries();
    return NextResponse.json({
      success: true,
      total: deliveries.length,
      deliveries,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trackingNumber = body.trackingNumber || `PRTX-${Math.floor(10000 + Math.random() * 90000)}-LKO`;

    const newBooking: DeliveryBooking = {
      id: body.id || `del-${Date.now()}`,
      trackingNumber,
      status: body.status || 'BOOKING_CREATED',
      createdAt: body.createdAt || 'Just now',
      ...body,
    };

    saveServerDelivery(newBooking);

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Delivery ID is required' }, { status: 400 });
    }

    const updated = updateServerDelivery(id, partial);
    return NextResponse.json({ success: true, deliveries: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
