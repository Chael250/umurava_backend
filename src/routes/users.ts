import { Request, Response, Router } from "express"
import asyncMiddleware from "../middlewares/asyncMiddleware.js"
import adminMiddleware from "../middlewares/adminMiddleware.js"
import { User, validate } from "../models/usersModel.js"
import bcrypt from "bcrypt"
import _ from "lodash"
import mongoose from "mongoose"

const route = Router()

route.get("/", adminMiddleware, asyncMiddleware(async (req:Request, res:Response) => {
    const users = await User.find({}).sort("name");
    if(!users) {
        res.status(404).send("No users")
        return
    }
    res.status(200).send(users);
}))

route.get("/me", asyncMiddleware(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);
    if(!user) {
        res.status(403).send("Login")
        return
    }
    res.status(200).send(user)
}))

route.get("/:id", adminMiddleware, asyncMiddleware(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        res.status(404).send("Invalid ID provided")
        return
    }    
    res.status(200).send(user)
}))

export default route

route.post("/", asyncMiddleware(async (req: Request, res: Response) => {
    const { error } = validate(req.body)
    if(error) {
        res.status(400).send(error.details[0].message)
        return
    }

    const userVerify = await User.findOne({email: req.body.email})
    if(userVerify) {
        res.send({message: "User already exists..."})
        return;
    }
    let user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role,
        profile_pic: req.body.profile_pic,
        country: req.body.country,
    })

    user.password = user.generatePassword()
    await user.save()
    const token = user.generateAuthToken()
    res.header("x-auth-token", token).send(_.pick(user, ["id", "last_name", "email"]))

}))

route.put("/:id", asyncMiddleware(async (req:Request, res:Response) => {
    const id = req.params.id
    const user = User.findById(req.params.id)
    if(!user){
        res.status(404).send("The user doesn't exists")
        return
    }

    const newUser = await User.findById(req.params.id,{
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role: req.body.role,
        profile_pic: req.body.profile_pic,
        country: req.body.country,
        challenges_id: req.body.challenges_id,
    },{new:true})

    await newUser?.save()
    res.status(201).send(newUser)
}))

route.delete("/:id", adminMiddleware, asyncMiddleware(async (req:Request, res:Response) => {
    const user = await User.findOneAndDelete({_id: req.params.id})
    if(!user){
        res.status(404).send("The user doesn't exists")
        return
    }

    res.send("Deleted Successfully")
}))