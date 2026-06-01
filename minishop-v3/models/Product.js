import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image:       { type: String, default: '' },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ category: 1, active: 1 });

export default mongoose.model('Product', productSchema);
