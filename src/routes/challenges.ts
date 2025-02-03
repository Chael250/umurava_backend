import { Request, Response, Router } from "express"
import asyncMiddleware from "../middlewares/asyncMiddleware.js" 
import { validate, Challange } from "../models/challangesModel.js"
import adminMiddleware from "../middlewares/adminMiddleware.js"

const route = Router()

route.get("/", asyncMiddleware(async (req:Request, res:Response) => {
    const challenges = await Challange.find({}).sort("name");
    if(!challenges){
        res.status(404).send("No challenges")
        return
    }
    res.status(200).send(challenges)
}))

route.get("/it", asyncMiddleware(async (req:Request, res:Response) => {
    const challange = await Challange.findById(req.user?.id);
    if(!challange) {
        res.status(403).send("Login")
        return
    }
    res.status(200).send(challange)
}))

route.get("/:id", asyncMiddleware(async (req:Request, res:Response) => {
    const challange = await Challange.findById(req.params.id)
    if(!challange) {
        res.status(404).send("Invalid ID provided")
        return
    }    
    res.status(200).send(challange)
}))

route.post("/", asyncMiddleware(async (req: Request, res: Response) => {
    const { error } = validate(req.body)
    if(error) {
        res.status(400).send(error.details[0].message)
        return
    }

    const challengeVerify = await Challange.findOne({email: req.body.email})
    if(challengeVerify) {
        res.send({message: "Challenge already exists..."})
        return;
    }
    let challange = new Challange({
        title: req.body.title,
        deadline: req.body.deadline,
        duration: req.body.duration,
        prize: req.body.prize,
        email_of_submition: req.body.email_of_submition,
        project_description: req.body.project_description,
        project_brief: req.body.project_brief,
        project_requirements: req.body.project_requirements,
        is_open: req.body.is_open,
        is_on_going: req.body.is_on_going,
        skilled_needed: req.body.skilled_needed,
        is_completed: req.body.is_completed
    })

    await challange.save()
    res.status(201).send(challange)
}))

route.put("/:id", asyncMiddleware(async (req:Request, res:Response) => {
    const id = req.params.id
    const challange = Challange.findById(req.params.id)
    if(!challange){
        res.status(404).send("The user doesn't exists")
        return
    }

    const newChallenge = await Challange.findById(req.params.id,{
        title: req.body.title,
        deadline: req.body.deadline,
        duration: req.body.duration,
        prize: req.body.prize,
        email_of_submition: req.body.email_of_submition,
        project_description: req.body.project_description,
        project_brief: req.body.project_brief,
        project_requirements: req.body.project_requirements,
        is_open: req.body.is_open,
        is_on_going: req.body.is_on_going,
        skilled_needed: req.body.skilled_needed,
        is_completed: req.body.is_completed
    })    
    await newChallenge?.save()
    res.status(201).send(newChallenge)
}))

route.delete("/:id", adminMiddleware, asyncMiddleware(async (req:Request, res:Response) => {
    const challange = await Challange.findOneAndDelete({_id: req.params.id})
    if(!challange){
        res.status(404).send("The challenge doesn't exists")
        return
    }

    res.send("Deleted Successfully")
}))

export default route
