const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const infSchema=new Schema({
    nameOfTheCompany: String,
    sector: String,
    companyId:{
        type: Schema.Types.ObjectId,
        ref:'Company'
    },
    website: String,
    duration:String,
    description: String,
    designation: String, 
    mode: String,
    placeOfPosting: String,
    btechStudents: [{String}],
    fiveYrsStudents: [{String}],
    skillBasedStudents: [{String}],
    mscStudents: [{String}],
    msctechStudents: [{String}],
    mtechStudents: [{String}],
    mbaStudents: [{String}],
    shortlistFromResumes:Boolean,
    eligibilityCriteria: String,
    typeOfTest: String, 
    otherRounds: [{String}],
    totalRounds: int,
    numberOfOffers: int,
    stipend: String,
    provisionForPPO: Boolean,
    ctcDetails: String,
    documents: [{String}],
})


module.exports = mongoose.model('INF',infSchema);