const bcrypt = require('bcrypt')
const { User } = require('../models/users')
const Joi = require('joi')
module.exports = {

    
    async postLogin(req, res) {
        
        const { email, password } = req.body
        const { error } = validateAuth({ email, password})
        if (error) return res.status(400).send(error.details[0].message)
        
        let user = await User.findOne({ email: email })
        if (!user) return res.status(400).send('Invalid email or password')
        
        const validatePassword = await bcrypt.compare(password, User.password)
        if (!validatePassword) return res.status(400).send('Invalid email or password')
        
        const token = user.generateAuthToken()
        
        res.setHeader("x-auth-token", token)
        res.render('/')
        // res.status(200).send(token)
    },
    // async checkUser (request, response) {

    //     const { token = null } = (/token=(?<token>[^;]*)/.exec(request.headers.cookie) || {}).groups || {} // Or  better use  cookie-parser
    
    //     crudModel.verifyUser((result) => {
    //         if (Array.isArray(result) && result.length > 0) {
    //             if(result[0].email == request.body.email && result[0].password == request.body.password){
    //                 let jwtToken = jwt.sign({
    //                     email: result[0].email,
    //                     user_id: result[0].uid
    //                 }, "mohit_pandey_1996", {
    //                     expiresIn: 300000
    //                 });
    
    
    //                 response.cookie('token', jwtToken, { 
    //                     httpOnly: true,
    //                     // secure: true // - for secure, https only cookie
    //                 });
    
    
    //                 response.render(''); // - now we don't need to appear token to the view, because it automatically appears in cookies in each request
    
    
    //             }
    
    //         } else {
    //             console.log('Invalid Username or Password');
    //             response.render('/??');
    //         }
    
    //     }, token); // <- pass token
    
    
    // },
    

    
}
function validateAuth(auth) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(auth);
}