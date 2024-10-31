const mongoose=require("mongoose");
const {Schema}=mongoose;


const appliedCandidatesSchema=new Schema({
    userProfile:{
        type:Schema.Types.ObjectId,
        ref:"UserProfile",
        required:true
    },
    job:{
        type:Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    appliedDate:{
        type:Date,
    },
    stage:{
        type:"String",
        enum:["Applied","Screening","Interview","Hired","Rejected"],
        default:'Applied'
    },

    //optional parameters for Future Reference for fetching user profile details

    //resume, userProfile Details, .........

});

const Application=mongoose.model('Application',appliedCandidatesSchema);
module.exports=Application;
