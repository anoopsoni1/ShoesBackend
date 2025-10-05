import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
     {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
      default: "",
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
  },
  {
    timestamps: true
  }
);

export const Address = mongoose.model("Form", formSchema);
