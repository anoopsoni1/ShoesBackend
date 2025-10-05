import {Address} from "../Models/Adrress.models.js"
import { ApiError } from "../utils/Apierror.js";
import { Asynchandler } from "../utils/Asynchandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const  createAddress = Asynchandler(async(req ,res )=>{
try {
  const {formData , userId } =  req.body

    if(!userId) throw new ApiError(400 , " User id is Required")
  console.log("Received form data:", formData);

  
  const { firstName, lastName, email, phoneNumber, country, city, streetAddress, area, postalCode } = formData;

  if (!firstName || !email) {
    return res.status(400).json({ message: "First name and email are required." });
  }

   let cartting  = await Address.findOne({ userId });
    if(!cartting){
   cartting = await Address.create({ userId ,
  firstName, lastName, email, phoneNumber, country, city, streetAddress, area, postalCode
      })
    }  else {
    await cartting.save() ;
    }

    res
    .status(200)
    .json(new ApiResponse(200 , cartting ,"Address save succesfully"))

  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}) 
  
const GetAddresses = Asynchandler(async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    let addresses = await Address.findOne({ userId }).populate("userId", "name email");

    if (!addresses) {
      return res.status(404).json({ success: false, message: "No addresses found for this user" });
    }

    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// exports.updateAddress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (updates.isDefault && updates.userId) {
//       await Address.updateMany(
//         { userId: updates.userId },
//         { $set: { isDefault: false } }
//       );
//     }

//     const address = await Address.findByIdAndUpdate(id, updates, { new: true });

//     if (!address) {
//       return res.status(404).json({ success: false, message: "Address not found" });
//     }

//     res.status(200).json({ success: true, message: "Address updated", address });
//   } catch (error) {
//     console.error("Error updating address:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
 
// exports.deleteAddress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const address = await Address.findByIdAndDelete(id);

//     if (!address) {
//       return res.status(404).json({ success: false, message: "Address not found" });
//     }

//     res.status(200).json({ success: true, message: "Address deleted" });
//   } catch (error) {
//     console.error("Error deleting address:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


export {
  createAddress ,
   GetAddresses
}