const whiteList = ['https://www.google.com','http://127.0.0.1:5500','http://localhost:3500','https://react-vendor-dashboard-sooty.vercel.app']

const corsOptions = {
    origin : (origin,callback) => {
        if(whiteList.includes(origin) !== 1 || !origin){
            callback(null,true)
        }else{
            callback(null,new Error('Not Allowed by CORS'))
        }
    },
    Credential : true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;