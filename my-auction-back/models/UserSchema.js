const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        requires: true
    },
    money: {
        type: Number,
        requires: true
    },
    myBids: {
        type: Array,
        requires: true
    }
})

module.exports = mongoose.model("userModel", UserSchema)