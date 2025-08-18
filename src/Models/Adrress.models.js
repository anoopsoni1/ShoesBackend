import mongoose from "mongoose"
import { Schema } from "mongoose";

const AddressSchema = new Schema({
  userid: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
          },
  recipientName: {
     type: String,
     trim: true
     },
  phone: { 
    type: String,
     trim: true 
    },

  label: { type: String, 
    trim: true, 
    enum: ['home','work','other'], 
    default: 'other' 
  }, 
  line1: {
     type: String,
     required: true,
      trim: true 
    }, 
  line2: { 
    type: String,
     trim: true 
    }, 
  city: { 
    type: String,
     required: true,
      trim: true 
    },
  state: { 
    type: String,
     trim: true 
    },
  postalCode: { 
    type: String, 
    trim: true,
     index: true
     },
  country: {
     type: String,
      required: true, 
      trim: true 
    },
}, {
  timestamps: true
});

export const Address = mongoose.model("Address" , AddressSchema) ;


