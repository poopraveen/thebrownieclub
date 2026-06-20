import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  emoji: { type: String, default: '🍫' },
  category: { type: String, default: 'Signature' },
  tag: { type: String, default: '' },
  tagColor: { type: String, default: 'bg-[#C8860A]' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Product = models.Product || model('Product', ProductSchema);
