import { logHandlers, logger } from "./startup/logging.js";
import db from "./startup/db.js";
import routes from "./startup/routes.js";
import express from "express"

const app = express()

app.use(express.json())
logHandlers()
routes(app)
db()

const port = process.env.PORT || 8081
app.listen(port, () => {
    logger.info(`Listening on port ${port}...`)
})