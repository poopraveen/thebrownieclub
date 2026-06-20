import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Notification } from '@/models/Notification';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.create(body);
    await Notification.create({
      type: 'order',
      message: `New order from ${body.name} — ₹${body.total} (${body.items?.length} item types)`,
      refId: order._id.toString(),
    });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
