require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/connDB');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const fs = require('fs')
const path = require('path')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const app = express()
const PORT = process.env.PORT || 3500

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use(express.static(path.join(__dirname,'public')))

connectDB();

app.use('/',require('./routes/root'))
app.use('/register',require('./routes/vendorRegister'))
app.use('/login',require('./routes/vendorLogin'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/vendorLogout'))
app.use('/vendors',require('./routes/api/vendors'))

app.use('/restaurant',verifyJWT,require('./routes/Restaurant'))
app.use('/products',verifyJWT,require('./routes/Product'))

app.get(/(.*)/, (req,res) => {
    if(req.accepts('html')){
        return res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        return res.json({error:'404 Page Not Found'})
    }else{
        res.status(404).type('txt').send("Page Not Found")
    }
})

app.use((err,req,res,next) => {
    console.log(err.stack)
    res.status(err.status || 500).json({message:"Internal Error"})
})

mongoose.connection.once('open',()=>{
    console.log('Mongoose is Connected');
    app.listen(PORT,()=>{console.log(`Sever is running at http://localhost:${PORT}`)})
})

