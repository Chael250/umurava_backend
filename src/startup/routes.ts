import { Express } from "express"
import users from "../routes/users.js"
import challenge from "../routes/challenges.js"

export default function(app:Express){
    app.use("/api/users",  users)
    app.use("/api/challenges", challenge)
}