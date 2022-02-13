const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const jnfSchema=new Schema({
    nameOfTheCompany: String,
    sector: String,
    companyId:{
        type: Schema.Types.ObjectId,
        ref:'Company'
    },
    website: String,
    description: String,
    designation: String, 
    placeOfPosting: String,
    btechStudents: [{String}],
    fiveYrsStudents: [{String}],
    skillBasedStudents: [{String}],
    mscStudents: [{String}],
    msctechStudents: [{String}],
    mtechStudents: [{String}],
    mbaStudents: [{String}],
    phdStudents: [{String}],
    eligibilityCriteria: String,
    shortlistFromResumes:Boolean,
    typeOfTest: String, 
    otherRounds: [{String}],
    totalRounds: int,
    numberOfOffers: int,
    ctc: String,
    ctcBreakup: String,
    bondDetails: String,
    documents: [{String}],
})


module.exports = mongoose.model('JNF',jnfSchema);