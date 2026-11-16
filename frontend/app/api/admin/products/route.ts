import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS_CATALOGUE } from '@/lib/shop-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase() || '';

    let products = PRODUCTS_CATALOGUE.map((p, idx) => ({
      ...p,
      sku: `JV-SKU-${String(idx + 101).padStart(4, '0')}`,
      stockQuantity: 45 - (idx * 3),
      isActive: true,
      salesCount: 12 + (idx * 5),
    }));

    if (category && category !== 'all') {
      products = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        pagination: {
          page: 1,
          pageSize: 50,
          pageCount: 1,
          total: products.length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      data: {
        id: `prod_${Date.now()}`,
        sku: `JV-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
