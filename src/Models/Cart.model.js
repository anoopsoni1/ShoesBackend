import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",                         
      required: true,
      unique: true,                     
    },
  items: [
    {
      id: String,
      name: String,
      image: { type: String, default: "" },
      price: Number,
      quantity: Number,
    },
  ],
} , {timestamps : true});

export const cart =  mongoose.model('cart', CartSchema);
