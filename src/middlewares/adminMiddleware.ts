import { NextFunction, Request, Response } from "express"

export default function (req: Request,res: Response, next: NextFunction){
    if(!req.user || req.user?.role !== "ADMIN") {
        res.status(401).send("Not Admin");
    }
    next()
}