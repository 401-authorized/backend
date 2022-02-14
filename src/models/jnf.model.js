const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const jnfSchema=new Schema({
    nameOfTheCompany: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref:'Company'
    },
    website: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    }, 
    placeOfPosting: {
        type: String,
        required: true
    },
    btechStudents: {
        type: [String],
        required: true
    },
    fiveYrsStudents: {
        type: [String],
        required: true
    },
    skillBasedStudents: {
        type: [String],
        required: true
    },
    mscStudents: {
        type: [String],
        required: true
    },
    msctechStudents: {
        type: [String],
        required: true
    },
    mtechStudents: {
        type: [String],
        required: true
    },
    mbaStudents: {
        type: [String],
        required: true
    },
    phdStudents: {
        type: [String],
        required: true
    },
    eligibilityCriteria: {
        type: String,
        required: true
    },
    shortlistFromResumes:{
        type: Boolean,
        required: true
    },
    typeOfTest: {
        type: String,
        required: true
    }, 
    otherRounds: {
        type: [String],
        required: true
    },
    totalRounds: {
        type: Number,
        required: true
    },
    numberOfOffers: {
        type: Number,
        required: true
    },
    ctc: {
        type: String,
        required: true
    },
    ctcBreakup: {
        type: String,
        required: true
    },
    bondDetails: {
        type: String,
        required: true
    },
    documents: {
        type: [String],
        required: true
    },
})


module.exports = mongoose.model('JNF', jnfSchema);