import mongoose from "mongoose"
mongoose.connect("mongodb+srv://unityplus:unity%40plus@unityplus.nfpzkp2.mongodb.net/unity_plus")
// mongoose.connect("mongodb+srv://unityplus:unity@plus@unityplus.nfpzkp2.mongodb.net/unity_plus")
const UserSchema= new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    // password: String,
})
const AdminSchema= new mongoose.Schema({
    orgName: String,
    email: String,
    password: String,
    location: String,
    phone: String,
    classification: String,
    description:String,
    websiteUrl: String
})
// const NgoFilterSchema = new mongoose.Schema({
//     classification: {
//         development: { type: [String], default: [] },
//         reliefAndHumanitarian: { type: [String], default: [] },
//         environmental: { type: [String], default: [] },
//         health: { type: [String], default: [] },
//         educational: { type: [String], default: [] },
//         womensRight: { type: [String], default: [] }
//     }
// });
// OTP SCHEMA
const OtpSchema= new mongoose.Schema({
    otp: Number,
    name: String,
    email: String,
    phone: String,
    password: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orgName: String,
    location: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref :"Admin"
    },
    classification: String,
    description:String,
    websiteUrl: String
})
export const User= mongoose.model('User',UserSchema)
export const Admin= mongoose.model('Admin',AdminSchema)
export const Otp= mongoose.model('Otp', OtpSchema)
// export const Ngo= mongoose.model('Ngo', NgoFilterSchema)
