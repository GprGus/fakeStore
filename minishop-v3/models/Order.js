import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: String,
  title:     String,
  price:     Number,
  quantity:  Number,
  image:     String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderId:  { type: String, required: true },  // ORD-0001
  items:    [orderItemSchema],
  total:    { type: Number, required: true },
  status:   { type: String, default: 'completed', enum: ['pending', 'completed', 'cancelled'] },
  whatsappSent: { type: Boolean, default: false },
  whatsappMsgId: String,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
