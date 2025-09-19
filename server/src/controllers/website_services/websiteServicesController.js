import { asyncHandler, sendResponse, statusType } from "../../utils/index.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";
import mongoose from "mongoose";

export const name = asyncHandler(async(req,res)=>{
  const n = "Suthakar"
  //part 1
  //age = 22
  //college
  //phone_no

  //part 2
  //Ek function lik jo numder of characters count karega aur uska output response 

  //part 3
  //data will come from frontend and return its count
      return sendResponse(
          res,
          true,
          {
            name:n
          },
          "My name is Suthakar",
          statusType.OK
      );
})
