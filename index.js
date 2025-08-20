require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/connDB');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const app = express()
const path = require('path')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3500

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use(express.static(path.join(__dirname,'/uploads')))
app.use(express.static(path.join(__dirname,'public')))

connectDB();

app.use('/',require('./routes/root'))
app.use('/register',require('./routes/vendorRegister'))
app.use('/login',require('./routes/vendorLogin'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/vendorLogout'))
app.use('/vendors',require('./routes/api/vendors'))

app.use(verifyJWT)
app.use('/Restaurant',require('./routes/Restaurant'))
app.use('/Product',require('./routes/Product'))

app.get(/(.*)/, (req,res) => {
    if(req.accepts('html')){
        return res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        return res.json({error:'404 Page Not Found'})
    }else{
        res.status(404).type('txt').send("Page Not Found")
    }
})

mongoose.connection.once('open',()=>{
    console.log('Mongoose is Connected');
    app.listen(PORT,()=>{console.log(`Sever is running at http://localhost:${PORT}`)})
})

