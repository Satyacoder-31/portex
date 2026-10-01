import { NextResponse } from 'next/server';
import { INITIAL_LISTINGS } from '@/lib/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const city = searchParams.get('city');

  let filtered = INITIAL_LISTINGS;
  if (category && category !== 'all') {
    filtered = filtered.filter(l => l.category === category);
  }
  if (city) {
    filtered = filtered.filter(l => l.location.city.toLowerCase() === city.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    listings: filtered,
  });
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

    const newListing = {
      id: `lst-${Date.now()}`,
      createdAt: 'Just now',
      views: 0,
      likes: 0,
      status: 'ACTIVE',
      ...body,
    };

    return NextResponse.json(
      { success: true, listing: newListing },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
