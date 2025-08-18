import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
       Id : String,
      name : String,
      price : Number,
      quantity : Number,
    }
  ]
} , {timestamps : true});

export const cart =  mongoose.model('cart', CartSchema);
