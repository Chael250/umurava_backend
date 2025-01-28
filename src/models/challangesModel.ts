import Joi, { ObjectSchema, ValidationResult } from "joi"
import mongoose, { NumberExpression, Schema } from "mongoose"

interface IChallanges {
    title: string,
    deadline: string,
    duration: number,
    prize: number,
    email_of_submition: string,
    project_description: string,
    project_brief: string,
    project_requirements: string,
    is_open: string,
    is_on_going: string,
    skilled_needed: string,
    is_completed: string
}

const challengesSchema = new Schema<IChallanges>({
    title:{
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 7,
        max: 21
    },
    prize: {
        type: Number,
        required: true,
        min: 100,
        max: 500
    },
    email_of_submition: {
        type: String,
        required: true
    },
    project_description: {
        type: String,
        required: true
    },
    project_brief: {
        type: String,
        required: true
    },
    project_requirements: {
        type: String,
        required: true
    },
    is_open: {
        type: String,
        required: true
    },
    is_on_going: {
        type: String,
        required: true
    },
    skilled_needed: {
        type: String,
        required: true
    },
    is_completed: {
        type: String,
        required: true
    }
})

const Challange = mongoose.model("Challange", challengesSchema)

function validate (challange:IChallanges):ValidationResult{
    const schema:ObjectSchema = Joi.object({
        title: Joi.string().required(),
        deadline: Joi.string().regex(/^(0[1-9]|[12][0-9]|3[12])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/).required(),
        duration: Joi.number().min(7).max(21).required(),
        prize: Joi.number().min(100).max(500).required(),
        email_of_submition: Joi.string().email().required(),
        project_description: Joi.string().required(),
        project_brief: Joi.string().required(),
        project_requirements: Joi.string().required(),
        is_open: Joi.string().required(),
        is_on_going: Joi.string().required(),
        skilled_needed: Joi.string().required(),
        is_completed: Joi.string().required(),
    })

    return schema.validate(challange)
}

export { Challange, validate, IChallanges }