import { NextResponse } from 'next/server';
import {
  getServerListings,
  saveServerListing,
  updateServerListing,
  deleteServerListing,
} from '@/lib/server/dataStore';
import { Listing } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const sellerId = searchParams.get('sellerId');

    let listings = getServerListings();

    if (category && category !== 'all') {
      listings = listings.filter(l => l.category === category);
    }
    if (city) {
      listings = listings.filter(l => l.location.city.toLowerCase() === city.toLowerCase());
    }
    if (sellerId) {
      listings = listings.filter(l => l.sellerId === sellerId);
    }

    return NextResponse.json({
      success: true,
      total: listings.length,
      listings,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Title and price are required fields.' },
        { status: 400 }
      );
    }

    const newListing: Listing = {
      id: body.id || `lst-${Date.now()}`,
      createdAt: body.createdAt || 'Just now',
      views: body.views ?? 1,
      likes: body.likes ?? 0,
      status: body.status || 'ACTIVE',
      verificationStatus: body.verificationStatus || 'PENDING',
      isFeatured: body.isFeatured ?? true,
      ...body,
    };

    const updatedListings = saveServerListing(newListing);

    return NextResponse.json(
      { success: true, listing: newListing, total: updatedListings.length },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...partial } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Listing ID is required' }, { status: 400 });
    }

    const updated = updateServerListing(id, partial);
    return NextResponse.json({ success: true, listings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Listing ID is required' }, { status: 400 });
    }

    const updated = deleteServerListing(id);
    return NextResponse.json({ success: true, listings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
