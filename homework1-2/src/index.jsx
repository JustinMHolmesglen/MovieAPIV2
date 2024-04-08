const express = require('express')
const session = require('express-session')
const { createServer } = require('http')
const ws = require('ws')
require('express-async-errors')
const error = require('./middleware/error')
const router = express.Router();
const morgan = require('morgan')
const favicon = require('serve-favicon');
const startupDebugger = require('debug')('app:startup')
require('dotenv').config()

const helmet = require('helmet')
const mongoose = require('mongoose')
const { User } = require('./models/users')
const { Review } = require('./models/reviews')

const path = require('path')

// const { registerValidation, loginValidation } = require("./validation")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const usersControllers = require('./controllers/users')
const fileUpload = require("express-fileupload");
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const config = require("config");
const axios = require("axios")
const bodyParser = require("body-parser")




// const NODE_CRUD_PRIVATE_KEY = config.get("node_crud_private_key")
const JWToken = "psmR3Hu0ihHKfqZymolm"

if(!JWToken){
    // console.error("FATAL ERROR: NODE_CRUD_PRIVATE_KEY is not defined");
    console.error("FATAL ERROR: JWToken is not defined");
    process.exit(1);
}

async function connect() {
    try {
        const connectionResult = await mongoose.connect(process.env.DB_URI);
        if (connectionResult) console.log("Connected to MongoDB");
    } catch (err) {
        (err) => console.error("Connection failed", err);
    }
}
connect();

const app = express()

//helmet

app.use(
    helmet.contentSecurityPolicy({
            
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js", "https://cdn.datatables.net/v/bs5/dt-1.13.4/datatables.min.js", "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js", "https://gc.kis.v2.scr.kaspersky-labs.com", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", "https://cdn.datatables.net/v/bs5/dt-1.13.4/datatables.min.css", "https://gc.kis.v2.scr.kaspersky-labs.com"],
            connectSrc: ["'self'", "http://localhost:3000/", "http://localhost:3000/review/", "http://localhost:3000/members/", "http://localhost:3000/edit/", "gc.kis.v2.scr.kaspersky-labs.com"],
            imgSrc: ["'self'", "http://image.tmdb.org"],
            objectSrc: ["'none'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            upgradeInsecureRequests: [],
          },
                  
        
        
    })
    )

// CORS policy
// app.use((req, res, next) => {
//     res.header('Access-Control-Expose-Headers', 'x-auth-token');
//     // Additional CORS headers...
//     next();
//   });    


const members = require('./routes/members')
const add = require('./routes/add')
const users = require('./routes/users')
const edit = require('./routes/edit')
const update = require('./routes/update')
const del = require('./routes/delete')
const register = require('./routes/register')
const login = require('./routes/login')
const about = require('./routes/about')
const contact = require('./routes/contact')
const auth = require('./routes/auth')
const admin = require('./middleware/admin')
const apiData = require('./routes/about')
const review = require('./routes/review')
const reviews = require('./routes/reviews')
// const showCards = require('./routes/about')




// const routes = require('./routes/routes')

const log = require('./middleware/error')


startupDebugger("this is a test")


// middlewares

// app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: true }));


// app.use(require("cookie-parser")());  
app.use(session({
        secret: 'psmR3Hu0ihHKfqZymolm',
        saveUninitialized: true,
        resave: false
    }))
    
    app.use((req, res, next) => {
        res.locals.message = req.session.message;
        delete req.session.message;
        next();
    })
    
    //make public routes
    
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.get('/styles.css', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'css', 'styles.css'))
})

app.set('views', path.join(__dirname, 'views'));
// set template engine
app.set('view engine', 'ejs');
//serving blank favicon to keep from throwing 404 errors
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Setup config


// app.use('/routes', routes)


app.use('/members', members)
app.use('/about', about)
app.use('/contact', contact)
app.use('/users', users)
app.use('/add', add)
app.use('/edit', edit)
app.use('/register', register)
app.use('/login', login)
app.use('/auth', auth)
app.use('/admin', admin)
app.use('/delete', del)
app.use('/update', update)
app.use('/api-data', apiData)
app.use('/review', review)
app.use('/reviews', reviews)
// app.use('/show-cards', showCards)


if (app.get('env') === 'development') {
    
    app.use(morgan('tiny'))
};

// app.use(error);
// search form

app.get("/", (req, res) => {
    // res.send("All Users")
    res.render("index", { title: "Home page" })
});

app.get('/home', (req,res)=> {
    res.render("members", { title: "User page"})
})

//Api request
app.get("/api-data", async (req, res) => {
    try {
      const query = req.query.query;
      console.log(query);
      
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=3d79dbc634a0b88610e771cba8723bc4&query=${query}`);
      const apiData = response.data.results;
      console.log("running response");
      console.log(apiData);
      res.render('about', { apiData, isApiData: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  app.get("/about", async (req, res) => {
    try {
      res.render('about', { isApiData: false });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });


app.get("/contact", (req, res) => {
    // res.send("All Users")
    res.render("contact", { title: "Contact page" })
});

// app.post("/register", (req, res) => {
//     // res.send("All Users")
//     res.render("register_user", { title: "Registration page", imagePath: imagePath })
// });
app.post('/register', usersControllers.registerUser)

// app.post("/login/:userId", (req, res) => {
//     // res.send("All Users")
//     const { user } = req.params;
//     const data = ""
//     res.render("login", { user: user, data: data })
// });
app.post("/login", usersControllers.login);
//having to change from get to post , or play with userId setting s to work and it keeps breaking

app.get("/review/:userId", (req, res) => {
    const { userId } = req.params;
    res.render("review", { userId: userId})
});

// app.post("/edit/:userId", (req, res) => {
//   const { userId } = req.params;
//   res.render("members", { userId: userId})
// });

app.get("/reviews", async (req, res) => {
    try{

    const reviews = await Review.find({}).populate("userId", "name");
    // console.log(reviews)
    const users = await User.find({});
    const query = req.query.review; 
   

    //const query = reviews.map((review) => review.movie).join(","); 
    const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=3d79dbc634a0b88610e771cba8723bc4&query=${query}`
      );
      const searchResults = response.data.results;
      const apiData = response.data;
      console.log(searchResults)
      
    res.render("reviews", { searchResults: searchResults, reviews: reviews, users: users || [], apiData: apiData })
    }catch (error){
        console.error(error);
        res.status(500).send("Internal Server Error")
    }
});

app.get("/images", async (req, res) => {
    try {
      const { reviewId, userId } = req.query;
  
      // Retrieve the relevant apiData based on reviewId and userId
      const apiData = await fetchApiData(reviewId, userId);
  
      if (apiData && apiData.poster_path) {
        // If apiData and poster_path are available, construct the image URL
        const imageUrl = `https://image.tmdb.org/t/p/original${apiData.poster_path}`;
  
        // Send the image URL as the response
        res.send(imageUrl);
      } else {
        // Handle the case when apiData or poster_path is missing
        res.status(404).send("Image not found");
      }
    } catch (error) {
      console.log(error);
      // Handle the error and send an appropriate response
      res.status(500).send("Internal server error");
    }
  });
  
  

app.get("*", (req, res) => {
    // res.send("All Users")
    res.render("404", { title: "404 page" })
});

app.get("/logout", async (req, res) => {
    res.render("logout", { title: "Logout" })
});


const port = process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}...`));

module.exports = router;