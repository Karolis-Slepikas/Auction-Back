const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema ({
    photo: {
        type:String,
        required: true
    },
    title: {
        type: String,
        requires: true
    },
    price: {
        type: Number,
        requires: true
    },
    time: {
        type: Number,
        requires: true
    },
    owner: {
        type: String,
        require: true
    },
    bids: {
        type: Array,
        require: true
    }
})

module.exports = mongoose.model("productDB", ProductSchema)