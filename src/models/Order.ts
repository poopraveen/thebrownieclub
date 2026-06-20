import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      product: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'baking', 'delivered'] },
  createdAt: { type: Date, default: Date.now },
});

export const Order = models.Order || model('Order', OrderSchema);
