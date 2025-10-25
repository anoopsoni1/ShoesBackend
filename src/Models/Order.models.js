import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "Pending" },
    orderStatus: { type: String, default: "Processing" },
    shippingAddress: { type: Object, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
