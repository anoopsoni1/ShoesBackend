import { Router } from "express";
import { getCurrentUser, loginuser, logoutUser, registeruser, updateAccountDetails } from "../Controllers/User.controller.js";
import parseFormData from "../Middleware/multer.middleware.js";
import { Cartitem, Getcartitem ,RemoveCartItem } from "../Controllers/Cartitem.controller.js";
import  { verifyJWT} from "../Middleware/Auth.middleware.js";
 import { Chatbot } from "../Controllers/Chatbot.controller.js";
import Mail from "../Controllers/Email.sender.js";
import { createAddress , GetAddresses} from "../Controllers/Address.controller.js";
import {Payment, VerifyPayment} from "../Controllers/Payment.js";
import { Saveorder , Getorder, DeleteOrder } from "../Controllers/Order.controller.js";


const router = Router()
  
router.route("/register").post(parseFormData , registeruser)
router.route("/login").post(parseFormData , loginuser)
router.route("/cart").post(Cartitem)
router.route("/getcart/:userId").get( Getcartitem)
router.route("/logout").post(logoutUser)
router.route("/chat").post(Chatbot)
router.route("/profile").get(getCurrentUser)
router.route("/contact").post(Mail)
router.route("/update").post(updateAccountDetails)
router.route("/address").post(createAddress)
router.route("/getaddress/:userid").get(GetAddresses)
router.route("/payment").post(Payment)
router.route("/verifypayment").post(VerifyPayment)
router.delete("/cart/:userId/:itemId", RemoveCartItem)
router.route("/saveorder").post(Saveorder)
router.route("/getorder/:userId").get(Getorder)
router.route("/deleteorder/:orderId").delete(DeleteOrder)
export {router}