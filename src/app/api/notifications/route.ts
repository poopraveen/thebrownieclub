import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';

export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    const unread = await Notification.countDocuments({ read: false });
    return NextResponse.json({ success: true, notifications, unread });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (id) {
      await Notification.findByIdAndUpdate(id, { read: true });
    } else {
      await Notification.updateMany({ read: false }, { read: true });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
