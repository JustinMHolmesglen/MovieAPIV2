const express = require("express")
const router = express.Router()
const { default: mongoose } = require('mongoose')
const { userSchema } = require('./users')
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const config = require("config")



// Look for using id from dan's class, to create a reference for the two models - > Bootstrap for modals -> 
// in comment state model and validate pass the user and id as a reference for the model and the validation 

const reviewSchema = new mongoose.Schema({
    movie: {
        type: String, minlength: 2, maxlength: 64,
    },
    stars: {
        type: String, required: true, minlength: 1, maxlength: 512,
    },
    comment: {
        type: String, minlength: 10, maxlength: 255,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference the nested user schema
        ref: "User",
        required: true,
    }
});


const Review = mongoose.model('Review', reviewSchema)

function validateReview(review) {
    console.log(review)
    const schema = Joi.object({
       movie: Joi.string().min(2).max(64),  
       stars: Joi.any().required().min(1).max(512),
       comment: Joi.string().min(1).max(255),
       userId: Joi.string().required(),
                   
    })
    return schema.validate(review);
}

module.exports.reviewSchema = reviewSchema;
module.exports.Review = Review;
module.exports.validateReview = validateReview;