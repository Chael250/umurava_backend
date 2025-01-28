import mongoose, { Schema } from "mongoose"
import { v4 } from "uuid"
import jwt from "jsonwebtoken"
import config from "config"
import bcrypt from "bcrypt"
import Joi, { ObjectSchema, ValidationResult } from "joi"

interface IUser {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    profile_pic: string,
    country: string,
    challenges_id: mongoose.Types.ObjectId[],
    generateAuthToken: () => string,
    generatePassword: () => string
}

const userSchema = new Schema<IUser>({
    first_name:{
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    challenges_id:{
        type: [mongoose.Types.ObjectId],
        ref: "Challenge",
        required: true
    }
})

userSchema.methods.generateAuthToken = function(){
    jwt.sign({_id: this._id}, config.get("jwtPrivateKeyUser"))
}

userSchema.methods.generatePassword = async function():Promise<string>{
    const genSalt = await bcrypt.genSalt(10)
    return await bcrypt.hash(this.password,genSalt)
}

const User = mongoose.model("User", userSchema)

function validate(user:IUser):ValidationResult{
    const schema:ObjectSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        email: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).required(),
        role: Joi.string().required(),
        profile_pic: Joi.string().required(),
        country: Joi.string().required()
    })
    return schema.validate(user)
}

export { User, validate, IUser }