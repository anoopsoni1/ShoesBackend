import {Asynchandler} from "../utils/Asynchandler.js"
import Order from "../Models/Order.models.js"

const Saveorder = Asynchandler(async (req, res) => {
  try {
    if (!req.body.userId || !req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      address: req.body.address,
      paymentStatus: req.body.paymentStatus || "Pending",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
    
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: err.message });
  }
});

 const Getorder = Asynchandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});

export const DeleteOrder = Asynchandler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});




export {
    Saveorder , 
    Getorder
};
