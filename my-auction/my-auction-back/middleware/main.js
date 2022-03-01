const userModel = require("../models/UserSchema");
const productDB = require("../models/ProductSchema")

module.exports = {
    checkRegistration: async (req, res, next) => {
        const {username, pass1, pass2} = req.body
        const loggedUser = await userModel.findOne({username})
        if (loggedUser) {
            return res.send({message: "User already exists"})
        }
        if (pass1.length < 4 || pass1.length > 20) {
            return res.send({message: "Password is too long or too short"})
        }
        if (pass1 !== pass2) {
            return res.send({message: "Passwords don't match"})
        } else {
            next()
        }
    },
    checkItem: async (req, res, next) => {
        const {photo, title, price, time} = req.body
        console.log(time)
        // console.log(Date.now())
        if (!photo.includes("http")) return res.send({success: false, message: "Wrong url address"})
        if (title.length < 20 && title.length > 500) return res.send({
            success: false,
            message: "Title is too short or too long"
        })
        if (typeof price !== `number`) return res.send({success: false, message: "Price should be number"})
        if ((Date.now() + Number(time) * 60000) < Date.now()) return res.send({
            success: false,
            message: "Time is wrong"
        })
        next()
    },
    checkBid: async (req, res, next) => {
        const {bid, id} = req.body
        const {user} = req.session

        const item = await productDB.findOne({_id: id})
        console.log(item)
        if (item.bids.length > 0) {
            if (item.bids[item.bids.length - 1].bid > bid) return res.send({
                success: false,
                message: "Bid must be higher then last bid"
            })
            if (user.money - bid < 0) return res.send({
                success: false,
                message: "Not enough money"
            })

            if(item.time < Number(Date.now())) return res.send({success:false, message: "Auction is ended"})
        }
        if(user.username === item.owner) return res.send({success:false, message: "Can't bid on own product"})
        next()
    }
}