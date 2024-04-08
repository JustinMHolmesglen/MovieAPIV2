function log(req,res,next){
    console.log("This will run for every request");
    next()
}

module.exports = log