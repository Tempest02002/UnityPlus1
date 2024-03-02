import express from "express"
import { Admin } from "../db/db.js"

export function adminMiddleware(isPost){
    return async (req,res,next)=>{
        const {email}=req.body
        const existingUser= await Admin.findOne({email: email})
        if (isPost){
            if(!existingUser){
                next();
            }
            else{
                res.status(401).send("admin already exists")
            }
        }
        else{
            if(existingUser){
                next();
            }
            else{
                res.status(401).send("admin does not exists")
            }
        }
    }
}
