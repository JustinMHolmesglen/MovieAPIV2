const express = require("express")
const router = express.Router()
const { default: mongoose } = require('mongoose')
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const config = require("config")



const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, minlength: 3, maxlength: 50, trim: true, lowercase: true,
    },
    email: {
        type: String, required: true, minlength: 3, maxlength: 50, unique: true, trim: true, lowercase: true,
    },
    phone: {
        type: String, required: true, minlength: 10, maxlength: 12
    },
    image: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },

    isAdmin: Boolean,

    // created: {
    //     type: Date,
    //     default: Date.now,
    // }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        isAdmin: this.isAdmin
    }, process.env.TOKEN_SECRET = "psmR3Hu0ihHKfqZymolm"
    );
    return token;
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    console.log(user)
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(10).max(12).required(),
        image: Joi.any(),
        password: Joi.string().min(5).max(1024),
        password1: Joi.string().min(5).max(1024)
                   
    })
    return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;

