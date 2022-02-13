const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const hrSchema=new Schema({
    name: String,
    email: {
        type:String,
        unique:true
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref:'Company'
    },
    contact: {
        countryCode: String,
        mobileNumber: String
    },
    designation: String
})


module.exports = mongoose.model('Hr',hrSchema);