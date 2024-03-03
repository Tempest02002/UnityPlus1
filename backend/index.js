import express from "express"
import mongoose from "mongoose"
// import {  } from "./middlewares/usermiddle"
import { User, Admin, Otp} from "./db/db.js";
import { userMiddleware } from "./middlewares/usermiddle.js";
import { adminMiddleware } from "./middlewares/adminmiddle.js";
import bodyParser from "body-parser";
import { sendOtp } from "./auth_twilio/otp.js";
import cors from "cors";
import shortid from 'shortid';
import Razorpay from 'razorpay';

export const app= express();
const port= 8080;
// app.use(bodyParser)
app.use(express.json())
app.use(cors())
// User-Routes
app.post("/user/signup",userMiddleware(true), async(req,res)=>{
    const {name,email,phone}=req.body
    const otpValue= Math.floor(Math.random()*9000+1000)
    const sent= await sendOtp(phone,otpValue) 

    // Storing OTP in the Otp collection and associate it with the user using objectId of user
    await Otp.create({ otp: otpValue, name:name, email: email,phone: phone});  // otp saved in DB
    res.send("please enter OTP")
})
app.post("/user/signup/verify",async (req,res)=>{
    const {phone, otp}=req.body
    const otpDoc = await Otp.findOneAndDelete({ phone, otp }).exec();
    if (!otpDoc) {
        await Otp.findOneAndDelete({phone})
        return res.status(400).json({ message: "Invalid OTP" });
    }
    else{
        const user= await User.create({ name: otpDoc.name, email: otpDoc.email, phone: otpDoc.phone });
        res.json({
            msg: "Horraaaahhhhh"
        })
    }
})
app.post("/user/signin",async (req,res)=>{
    const {phone}=req.body
    const UserExist= await User.findOne({phone: phone})
    if(UserExist){
        const otpValue= Math.floor(Math.random()*9000+1000)
        const sent= await sendOtp(phone,otpValue)
        await Otp.create({ otp: otpValue, phone: phone});  // otp saved in DB
        res.send("please enter OTP")
    }
    else{
        res.status(404).send("User does not exist")
    }
})
app.post("/user/signin/verify", async (req,res)=>{
    const {phone, otp}= req.body
    const otpDoc = await Otp.findOneAndDelete({ phone, otp }).exec();
    if(otpDoc){
        res.send(true)
    }
    else{
        res.send("otp entered is wrong")
    }
})
// app.put("/user/update",userMiddleware(false), async (req,res)=>{
//     const {email,password}= req.body
//         const updatedUser= await User.findOneAndUpdate({email: email},{$set:{password:password}},{new: true})
//         res.json({
//             msg: "updated successfully",
//             updatedUser
//         })
// })
app.get(`/user/logged-in`,async (req,res)=>{
    const phone= req.query.phone
    // const phone= req.body.phone
    // console.log(phone);
    // const loggedInUser= await User.findOne({phone: phone})
    const loggedInUser= await User.aggregate([
        {
            $match: {
                phone: phone
              },
        },
        {
          $project:
            {
              _id: 0,
              name: 1,
            },
        },
      ])
    //   res.json({
    //     name:loggedInUser
    //   })
    res.send(loggedInUser)
})


// NGO ROUTES
app.get("/ngos",async(req,res)=>{
    const ngoType=req.query.ngoType
    // const ngoList= await Admin.find({})
    const ngosList= await Admin.aggregate([
        {
          $match: {
            classification: ngoType,
          },
        },
        {
          $project:
            {
              _id: 0,
              orgName: 1,
              email: 1,
              location: 1,
              classification: 1,
              description: 1,
              websiteUrl: 1
            },
        },
      ])
      res.json({
        ngoList: ngosList
      })
})
app.get("/ngos/all", async (req,res)=>{
  // const allNgos= await Admin.find({})
  const ngosArray= await Admin.aggregate([
    {
          $project:
            {
              _id: 0,
              orgName: 1,
              email: 1,
              location: 1,
              classification: 1,
              description: 1,
              websiteUrl: 1
            },
        },
        {
          $group: {
            _id: "$classification",
            ngos: {
              $push: "$$ROOT",
            },
          },
        }
  ])
  const allNgos= []
  for (let i=0; i<ngosArray.length; i++){
    for (let j=0; j<ngosArray[i].ngos.length; j++){
      allNgos.push(ngosArray[i].ngos[j])
    }
  }
  res.json({
    allNgos: allNgos
  })
})
// Admin-Routes

app.post("/admin/signup",adminMiddleware(true), async(req,res)=>{
    const {orgName,email,password,phone,location,classification,description,websiteUrl}=req.body
    const otpValue= Math.floor(Math.random()*9000+1000)
    const sent= await sendOtp(phone,otpValue) 

    // Storing OTP in the Otp collection and associate it with the user using objectId of user
    await Otp.create({ otp: otpValue, orgName: orgName, email: email,password: password,phone: phone, location: location,classification: classification,description: description,websiteUrl: websiteUrl});  // otp saved in DB
    res.send("please enter OTP")
})
app.post("/admin/signup/verify",async (req,res)=>{
    const {phone, otp}=req.body
    const otpDoc = await Otp.findOneAndDelete({ phone, otp }).exec();
    if (!otpDoc) {
        await Otp.findOneAndDelete({phone})
        return res.status(400).json({ message: "Invalid OTP" });
    }
    else {
        // await Ngo.updateOne({}, { $push: { [classification]: otpDoc.orgName } });
        // Update NgoFilterSchema with new NGO name under the selected classification
        const admin = await Admin.create({ orgName: otpDoc.orgName, email: otpDoc.email, password: otpDoc.password, phone: otpDoc.phone, location: otpDoc.location, classification: otpDoc.classification,description: otpDoc.description, websiteUrl: otpDoc.websiteUrl });
        res.json({
            msg: "Admin Created"
        });
    }
})
app.post("/admin/signin",async (req,res)=>{
    const {phone}=req.body
    const AdminExist= Admin.findOne({phone: phone})
    if(AdminExist){
        const otpValue= Math.floor(Math.random()*9000+1000)
        const sent= await sendOtp(phone,otpValue)
    }
    else{
        res.status(404).send("Admin does not exist")
    }
})

// app.put("/admin/update",userMiddleware(false), async (req,res)=>{
//     const {phone,password}= req.body
//         const updatedAdmin= await User.findOneAndUpdate({phone: phone},{$set:{password:password}},{new: true})
//         res.json({
//             msg: "updated successfully",
//             updatedAdmin
//         })
// })

//razorpay

const razorpay = new Razorpay({
    key_id: 'rzp_test_Xdqdq0R7A7gS4N',
    key_secret: 'kghZfg5IOyi2zKZInOVkxS8k'
  });
  
  app.post('/api/order', async (req, res) => {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
  
    const payment_capture = 1;
    const currency = 'INR';
  
    const options = {
      amount: amount * 100, 
      currency,
      receipt: shortid.generate(),
      payment_capture
    };
  
    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      res.json({
        id: response.id,
        currency: response.currency,
        amount: amount 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

app.listen(port,()=>{
    console.log("listening on 8080")
})
