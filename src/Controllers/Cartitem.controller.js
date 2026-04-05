import { Asynchandler } from "../utils/Asynchandler.js";
import { cart } from "../Models/Cart.model.js";

function normalizeImageForStorage(img) {
  if (img == null) return "";
  const s = String(img).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return `https:${s}`;
  if (s.startsWith("/")) return s;
  const file = s.replace(/^\.\//, "").split("/").pop();
  return file ? `/${file}` : "";
}

const normalizeCartItem = (item) => ({
  id: String(item.id),
  name: item.name,
  price: Number(item.price),
  quantity: Number(item.quantity) || 1,
  image: normalizeImageForStorage(item.image),
});

const Cartitem = Asynchandler(async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "userId and items are required" });
    }

    const normalized = items.map(normalizeCartItem);

    let cartt = await cart.findOne({ userId });

    if (!cartt) {
      cartt = await cart.create({ userId, items: normalized });
    } else {
      normalized.forEach((item) => {
        const index = cartt.items.findIndex((i) => String(i.id) === item.id);
        if (index > -1) {
          cartt.items[index].quantity += item.quantity;
        } else {
          cartt.items.push(item);
        }
      });

      await cartt.save();
    }
    res.json(cartt);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

const Getcartitem = Asynchandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    let carting = await cart.findOne({ userId }).populate("userId", "FirstName email");

    if (!carting) {
      carting = await cart.create({ userId, items: [] }); 
    }

    res.json(carting);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
})

const RemoveCartItem = Asynchandler(async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const userCart = await cart.findOne({ userId });
    if (!userCart) return res.status(404).json({ message: "Cart not found" });

    userCart.items = userCart.items.filter(
      (item) => String(item.id) !== String(itemId)
    );
    await userCart.save();

    res.status(200).json({ message: "Item removed", items: userCart.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
});


export { Cartitem, Getcartitem, RemoveCartItem};
