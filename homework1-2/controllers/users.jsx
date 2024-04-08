yconst express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/users')
const { fileUploader, validateFile } = require('../util/fileUploader')
const fs = require('fs');
const bcrypt = require('bcrypt');
const Joi = require('joi')
const _ = require('lodash');
const path = require("path");
const jwt = require('jsonwebtoken');

// const { token } = require('morgan');

module.exports = {

  async getAllUsers(req, res) {
    try{
    const users = await User.find({}).sort("name")
    // res.send(users)
    res.render('members', {
    title: "User Page",
    users: users,
    })
    }catch(err){
      console.log(err)
      res.status(500).send("There has been a server error")
    }
  },
    
  async getUsersById(req, res) {
    
    const user = await User.findById(req.params.id)
    if (!user) return res.status(400).send("The user with that ID doesn't exist")
    res.render('edit_users', { title: "edit", users: user })
  },

  async deleteUser(req, res) {
    try {
      
      // const token = req.headers['x-auth-token'];
      // const decodedToken = jwt.verify(token, 'psmR3Hu0ihHKfqZymolm');
      // console.log(decodedToken);
      const result = await User.findByIdAndRemove(req.params.id);
      if (!result) return res.status(404).send("The user with that ID doesn't exist")
      if (result.image !== "") {
        try {
          await fs.unlinkSync('./' + result.image);
        } catch (err) {
          console.log(err);
        }
      }
      req.session.message = {
        type: 'success',
        message: 'User Deleted Successfully!'
      };
      res.send('deleted');
    } catch (err) {
      res.json({ message: err.message });
      if (err) return res.status(500).send("File was not deleted!")
    }
  },

  async editUser(req, res) {
    try {
      // console.log(req.body);
      // const token = req.header('x-auth-token');
      // const decodedToken = jwt.verify(token, "psmR3Hu0ihHKfqZymolm");
      // console.log(decodedToken);
      //deconstruct
      const { name, email, phone } = req.body;
      //check for errors and validate with Joi
      const { error } = validateUser(req.body);
      if (error) {
        console.log(error.details[0]);
        return res.status(400).send(error.details[0].message);
      }
  
      let filePath;
      //check if files exists before deconstrucing the image, with (req.files && req.files.image) the program
      //will throw an error if a new file is not uploaded 
      console.log(req.body);
      if (req.files && req.files.image) {
        console.log("uploding file")
        const { image } = req.files;
        // set allowed file types and size
        const allowedExtensions = ["jpg", "png"];
        const fileError = validateFile(image, 1000000, allowedExtensions);
        //check if anything went wrong with uploading the file
        if (fileError) {
          return res.status(400).send(fileError);
        }
        filePath = fileUploader(image, "./uploads/", name);
        console.log(filePath)
        if (!filePath) {
          return res.status(401).send("You must upload an image");
        }
      }
  
      const userData = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, phone, image: filePath },
        { new: true }
        );
        console.log(userData);
        console.log(req.params.id);
        
        //return a success message to the GUI
      req.session.message = {
        type: 'success',
        message: 'User Edited Successfully!',
      
      };
      return res.render('members', { users: userData });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong with the user edit on the server! Try again later");
    }
  },

  // async putUser(req, res) {
  //   try {
  //     const { error, name, email, phone } = validateUser(req.body);
  //     if (error) return res.status(400).send(error);
  
  //     let image = req.body.old_image; // Default to the old image
  
  //     if (req.file) {
  //       // If a new image is uploaded, update the image variable and handle the file operations
  //       image = req.file.filename;
  //       fs.unlinkSync('./' + req.body.old_image); // Delete the old image file
  //     }
  
  //     const user = await User.findByIdAndUpdate(
  //       req.params.id,
  //       { name: name, email: email, phone: phone, image: image },
  //       { new: true }
  //     );
  
  //     if (!user) {
  //       return res.status(404).send("The user with the given ID was not found!");
  //     }
  
  //     res.send(user);
  //     req.session.message = {
  //       type: 'success',
  //       message: 'User Changed Successfully!'
  //     };
  //     res.redirect('/')
  //   } catch (err) {
  //     if (err) return res.status(500).send("Something Went Wrong With Your File Edit On The Server!  Try Again Later")
  //     console.log(err);
  //     res.redirect('/');
  //   }
  // },
  



  async login(req, res) {
    //Validate Data
    try{
      console.log(req.body)
      const { email, password } = req.body;

      const secretKey = "psmR3Hu0ihHKfqZymolm";

      const schema = Joi.object({
        email: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(5).max(1024).required(),
      })

      const { error } = schema.validate({ email, password})

      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      //CHECK IF USER EXISTS
      const emailExist = await User.findOne({ email: email });
      console.log(emailExist)
      if (!emailExist){
        return res.status(400).send("User not registered");
      }

      const validatePassword = await bcrypt.compare(password, emailExist.password)
      if (!validatePassword) return res.status(400).send('Invalid email or password')
          
      const userData = new User(emailExist);    


    // User = new User(
    //   _.pick(req.body, ['email', 'password'])
    // )
    // const users = await User.create(data)
    // await users.save();
    console.log(userData._id)
    // CREATE AND ASSIGN TOKEN --- Remove
    const authToken = userData.generateAuthToken()
    // res.header("x-auth-token", token)
    const reply = {
      user: userData,
      token: authToken,
    }

    const { user: replyUser, token: replyToken } = reply;

    res.header("x-auth-token", replyToken).status(200).json({ user: replyUser, token: replyToken });
    // const token = jwt.sign({ userId: userId }, 'psmR3Hu0ihHKfqZymolm');
    // const token = jwt.sign({ _id: user._id }, NODE_CRUD_PRIVATE_KEY);
    // console.log("about to validate")
  } catch (error){
    console.log(error)
    res.status(500).send('Server error')
  }
  },

  
        
       async registerUser(req, res) {
  try {
    const { name, email, phone, password, password1 } = req.body;
    let image = undefined; // Declare image variable with a default value

    // Validate Data
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if form field passwords match and prompt the user if they don't
    if (password !== password1) return res.status(400).send("Passwords do not match");

    // Check if User Exists
    const emailExist = await User.findOne({ email: email });
    if (emailExist) return res.status(400).send("Email already exists");

    // Check if image file is uploaded
      (req.files && req.files.image) 
      image = req.files.image; // Update the image variable with the uploaded file
      console.log(req.files);

      const allowedExtensions = ["jpg", "png"];
      const fileError = validateFile(image, 15000000, allowedExtensions);
      if (fileError) return res.status(400).send(fileError);

      const filePath = fileUploader(image, "./uploads/", name);
      console.log(filePath);
      image = filePath; // Update the image variable with the file path
    // } else {
    //   return res.status(400).send("No image uploaded!");
    // }

    // Hash and salt the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      image: image,
      password: hashPassword,
    });
    console.log(image);

    const savedUser = await newUser.save();

    console.log(newUser._id);
    // CREATE AND ASSIGN TOKEN --- Remove
    const authToken = savedUser.generateAuthToken();
    const reply = {
      user: savedUser,
      token: authToken,
    };

    const { user: replyUser, token: replyToken } = reply;

    res.set("x-auth-token", replyToken).status(200).json({ user: replyUser, token: replyToken, imagePath });

    req.session.message = {
      type: 'success',
      message: 'User Registered Successfully!'
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });

    req.session.message = {
      type: 'danger',
      message: 'Please Check that your User is listed, User may have failed to register'
    };
  }
},
          async getUserTokenId(req, res) {
            const user = await User.findById(req.user.userId).select("-password")
            res.send(user)
          },

          
        
          

          
}

function validateAuth(auth) {
  const schema = Joi.object({
      email: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(auth);
}
