const mongoose=require('mongoose');
require('dotenv').config();

const ConnectDB=async ()=>{

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connection established');
    }catch(error){
        console.log('Error connecting to databse',error.message);
    }
};

module.exports={ConnectDB};