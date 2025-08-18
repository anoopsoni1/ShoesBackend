import { Asynchandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { cart} from "../Models/Cart.model.js";

const Cartitem = Asynchandler(async (req, res) => {
  const { userId, items } = req.body;

  if (!(userId || items)) {
    throw new ApiError(400, "User ID or items are missing");
  }
  
    try {
    let existingCart = await cart.findOne({ userId });
    if (existingCart) {
      existingCart.items = items;
      await existingCart.save();
      console.log("Cart updated");
      res.json(existingCart);
    } else {
      const newCart = await cart.create({ userId, items });
      console.log("Cart created");
        res.json(newCart);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to save cart" });
  }
});

const Getcartitem = Asynchandler(async (req, res) => {
              try {
       const { userId } = req.params;
          
    const cartitem = await cart.findOne({ userId });

      if(!cartitem) throw new ApiError(404, "Cart not found");
           res.json(cartitem || { items: [] });
     } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
       }
});

export { Cartitem, Getcartitem };
