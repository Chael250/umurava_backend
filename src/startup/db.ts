import mongoose from "mongoose";
import config from "config"
import { logger } from "./logging.js";

export default function(){
    mongoose.connect(config.get("db_connect"))
        .then(() => logger.info(`Connected to ${config.get("db_connect")} successfully...`))
        .catch((err) => logger.error(`Error while connecting to ${config.get("db_connect")}...`))
}