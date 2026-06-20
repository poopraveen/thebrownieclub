import { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
  type: { type: String, enum: ['order', 'contact'], required: true },
  message: { type: String, required: true },
  refId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = models.Notification || model('Notification', NotificationSchema);
