import userModel from "../model/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;
    //validations

    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "email is Required" });
    }
    if (!password) {
      return res.send({ message: "password is Required" });
    }
    if (!phone) {
      return res.send({ message: "phone number is Required" });
    }
    if (!address) {
      return res.send({ message: "address is Required" });
    }
    if (!answer) {
      return res.send({ message: "answer  is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing USer checking
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //register User
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "user REgistered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "INValid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    const match = await comparePassword(password, user.password);
    if(!match){
        return res.status(200).send({
            success:false,
            message:"INValid password"
        })
    }
   //token
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,
      {expiresIn:"7d",
    });
    res.status(200).send({
        success:true,
        message:"LOGIN succeccfully",
        user:{
           _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },
        token,

    });


  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ERRor in LOGIN ",
      error,
    });
  }
};

//fogotPassowrd controller

export const forgotPasswordController = async(req,res) =>{
  try {
    const { email, answer, newPassword } = req.body;

    if(!email){
      res.status(400).send({message: "email is required"})
    }
   if(!answer){
    res.status(400).send({ message:"answer is required"})
   }
   if(!newPassword){
    res.status(400).send({ message: "New Passwod is required"})
   }

   //check
   const user = await userModel.findOne({ email, answer });


   //validation
   if(!user){
    return res.status().send({
      success:false,
      message:"wrong Email or password "
    })
   }

   const hash = await hashPassword(newPassword)
   await userModel.findByIdAndUpdate(user._id,{password:hash})
   res.status(200).send({
    success:true,
    message:"Password Reset successfully",
   })




    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"something went wrong",
      error
    })
    
  }


}






//test controller for testing middleware  and helper
export const testController = (req,res) =>{
  res.send("protected Routes")

}
