import {Address} from "../Models/Adrress.models.js"
import { ApiError } from "../utils/Apierror.js";
import { Asynchandler } from "../utils/Asynchandler.js";

const  createAddress = Asynchandler(async(req ,res )=>{
try {
    const data = req.body
   const {userid} = req.params
      
        
      if(!userid) throw new ApiError("User ID is required");

      if(!data) throw new ApiError("Address is required");
    
         const addres = new Address(data);
              await addres.save();

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      addres,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}) 
  
const  GetAddresses = Asynchandler(async(req ,res)=>{
  try {
      const {userid} = req.params
      
        if (!userid) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }
    const addresses = await Address.find({ userid })
          console.log(addresses);
       res
       . status(200)
       .json({ success: true, addresses });
  }       catch (error) {
       console.error("Error fetching addresses:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
}) 

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