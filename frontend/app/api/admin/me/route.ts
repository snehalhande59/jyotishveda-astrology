import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      id: 1,
      email: 'admin@astroveda.com',
      username: 'AstroVeda Super Admin',
      role: 'admin',
    },
  });
}
