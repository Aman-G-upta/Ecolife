const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    avatar:{
        type:String,
        default:""
    },

    greenScore:{
        type:Number,
        default:0
    },

    xp:{
        type:Number,
        default:0
    },

    streak:{
        type:Number,
        default:0
    },

    lastActivityDate:{
        type:Date,
        default:null
    },

    badges:[
        {
            type:String
        }
    ]

},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);