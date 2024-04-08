const express = require('express');
const router = express.Router();
const { User } = require('../models/users')
const { Review, validateReview } = require('../models/reviews')
const auth = require('../middleware/auth')
const Joi = require('joi');



//export modules
module.exports = {

// functions

//Search for user


//1. Add Review

async addReview(req, res) {
    try{
        // console.log(req)
        console.log(req.body)
        console.log(req.params)
        console.log(req.headers["x-auth-token"])
        const { movie, stars, comment } = req.body;
        const  { userId } = req.params;
        
        const schema = Joi.object({
            movie: Joi.string().required(),
            stars: Joi.any().required(),
            comment: Joi.string().required(),
            userId: Joi.string().required(),
            
          });

          const { error } = schema.validate({ movie, stars, comment, userId });
      
          if (error) {
            return res.status(400).send(error.details[0].message);
          }
      
          const user = await User.findById(userId); // Find the user with the specified ID in the users collection
          
          if (!user){
          return res.status(404).send("The user with the given ID was not found."); // If the user is not found, send an error message
          }
          
            const data = new Review({
                    movie,
                    stars,
                    comment,
                    userId: user,
                    }
            
        
    );

    const review = await Review.create(data)
    await review.save();

    res.redirect('/');
}catch(err){
    console.log(err);
    res.status(500).send('Internal Server Error');
}
},

// 2. Get All Reviews

async getAllReviews(req, res) {

    const reviews = await Review.find({}).populate("userId", "name")
    res.status(200).send(reviews)

},

async singleReview(req, res) {

    const { id } = req.params;
    const reviews = await Review.findById({id})
    res.status(200).send(reviews)

},
    

}