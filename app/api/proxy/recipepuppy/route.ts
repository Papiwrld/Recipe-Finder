import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ingredient = searchParams.get('i');

  if (!ingredient) {
    return NextResponse.json(
      { error: 'Ingredient parameter required' },
      { status: 400 }
    );
  }

  try {
    // RecipePuppy API endpoint
    const url = `http://www.recipepuppy.com/api?i=${encodeURIComponent(ingredient)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`RecipePuppy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error proxying RecipePuppy API:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch from RecipePuppy API' },
      { status: 500 }
    );
  }
}

