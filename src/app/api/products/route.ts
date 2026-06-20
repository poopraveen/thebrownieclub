import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const DEFAULT_PRODUCTS = [
  { name: 'Classic Dark Chocolate', description: 'Rich, dense, fudgy brownie made with 70% Belgian dark chocolate. The OG that started it all.', price: 80, emoji: '🍫', category: 'Signature', tag: 'Bestseller', tagColor: 'bg-amber-700', available: true, featured: true, sortOrder: 1 },
  { name: 'Salted Caramel Swirl', description: 'Gooey caramel ribbons through velvety chocolate batter, finished with Himalayan sea salt.', price: 100, emoji: '🍮', category: 'Signature', tag: 'Fan Favourite', tagColor: 'bg-orange-800', available: true, featured: true, sortOrder: 2 },
  { name: 'Cream Cheese Marble', description: 'Silky cream cheese swirled into chocolate perfection. Sweet, tangy, and absolutely dreamy.', price: 110, emoji: '🌀', category: 'Signature', tag: 'New', tagColor: 'bg-green-900', available: true, featured: true, sortOrder: 3 },
  { name: 'Nutella Stuffed', description: 'A hidden molten Nutella core inside our signature dark chocolate brownie. Pure joy.', price: 120, emoji: '🫙', category: 'Premium', tag: 'Indulgent', tagColor: 'bg-red-900', available: true, featured: true, sortOrder: 4 },
  { name: 'Walnut Crunch', description: 'Toasted California walnuts folded into our classic batter for the perfect texture contrast.', price: 90, emoji: '🌰', category: 'Signature', tag: 'Classic', tagColor: 'bg-stone-700', available: true, featured: false, sortOrder: 5 },
  { name: 'Cookies & Cream', description: "Oreo crumble on top and inside. Chocolate on chocolate on chocolate. Need we say more?", price: 105, emoji: '🍪', category: 'Signature', tag: 'Popular', tagColor: 'bg-blue-900', available: true, featured: false, sortOrder: 6 },
  { name: 'Biscoff Stuffed', description: 'Caramelised Biscoff butter centre wrapped in dark chocolate batter.', price: 125, emoji: '🧡', category: 'Premium', tag: 'Premium', tagColor: 'bg-orange-700', available: true, featured: false, sortOrder: 7 },
  { name: 'Espresso Chocolate', description: 'Barista-grade espresso meets 70% dark chocolate for a grown-up treat.', price: 95, emoji: '☕', category: 'Signature', tag: '', tagColor: '', available: true, featured: false, sortOrder: 8 },
];

export async function GET() {
  try {
    await connectDB();
    let products = await Product.find({ available: true }).sort({ sortOrder: 1, createdAt: 1 });
    if (products.length === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS);
      products = await Product.find({ available: true }).sort({ sortOrder: 1 });
    }
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
