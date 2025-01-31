import { Request, Response, Router } from "express"
import asyncMiddleware from "../middlewares/asyncMiddleware.js"
import adminMiddleware from "../middlewares/adminMiddleware.js"
import { User, validate } from "../models/usersModel.js"

const route = Router()

route.get("/", adminMiddleware, asyncMiddleware(async (req:Request, res:Response) => {
    const users = await User.find({}).sort("name");
    if(!users) return res.status(404).send("No users")
    
        res.status(200).send(users);
}))

route.get("/me", asyncMiddleware(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);
    if(!user) return res.status(403).send("Login")
    res.status(200).send(user)
}))

route.get("/:id", asyncMiddleware(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send("Invalid ID provided")
    res.status(200).send(user)
}))

route.post("/", asyncMiddleware(async (req: Request, res: Response) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
}))