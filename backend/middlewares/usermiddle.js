import express from "express"
import { User } from "../db/db.js"

export function userMiddleware(isPost){
    return async (req,res,next)=>{
        const {phone}=req.body
        const existingUser= await User.findOne({phone: phone})
        if (isPost){
            if(!existingUser){
                next();
            }
            else{
                res.status(401).send("user already exists")
            }
        }
        else{
            if(existingUser){
                next();
            }
            else{
                res.status(401).send("user does not exists")
            }
        }
    }
}
