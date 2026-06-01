import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name: {
    firstname: { type: String, default: '' },
    lastname:  { type: String, default: '' },
  },
  phone:   { type: String, default: '' },
  address: { type: String, default: '' },
  avatar:  { type: String, default: '' },
  role:    { type: String, default: 'user', enum: ['user', 'admin'] },
}, { timestamps: true });

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Verifica senha
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove senha do JSON retornado
userSchema.methods.toPublic = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
