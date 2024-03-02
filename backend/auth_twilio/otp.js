import twilio from "twilio";
import dotenv from "dotenv";
// import { verify } from "jsonwebtoken";

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export async function sendOtp(number, otp) {
    try {
      const message = await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: number,
      });

      console.log(`OTP sent successfully. SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error(`Error sending OTP: ${error.message}`);
      return false
    }
}

// const otp= Math.floor(Math.random()*9000+1000)
// sendOtp("+916398799630", otp)