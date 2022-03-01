const userModel = require("../models/UserSchema")
const productDB = require("../models/ProductSchema")

const bcrypt = require("bcrypt");
const {hash} = require("bcrypt");

module.exports = {
    doRegistration: async (req, res) => {
        const {username, pass1} = req.body

        const hash = await bcrypt.hash(pass1, 10)
        const user = new userModel()

        user.username = username
        user.password = hash
        user.money = 1000
        user.reservedMoney = 0

        user.save().then(data => {
            res.send({success: true, data})
        })
    },
    doLogin: async (req, res) => {
        const {username, pass} = req.body
        const user = await userModel.findOne({username})
        if (user) {
            const compare = await bcrypt.compare(pass, user.password)
            if (compare) {
                req.session.user = user
                res.send({success: true, message: "User logged successfully"})
            } else {
                res.send({success: false, message: "Wrong username or password"})
            }
        } else {
            res.send({success: false, message: "User doesn't exist"})
        }
    },
    createItem: async (req, res) => {
        const {photo, title, price, time} = req.body
        const {user} = req.session
        if (user) {
            const item = new productDB()

            item.photo = photo
            item.title = title
            item.price = price
            item.time = Date.now() + Number(time) * 60000
            item.owner = user.username
            item.bids = []

            item.save().then(data => {
                res.send({success: true, data})
            })
        }

    },
    getAllItems: async (req, res) => {
        const {user} = req.session

        if (user) {
            console.log(user)
            const list = await productDB.find()
            const findUser = await userModel.findOne({username: user.username})
            return res.send({success: true, list, findUser})
        }
        res.send({success: false, message: "User is not logged in"})
    },
    getSingleItem: async (req, res) => {
        const {id} = req.params
        const {user} = req.session

        if (user) {
            const item = await productDB.findOne({_id: id})
            return res.send({success: true, item})
        }
        return res.send({success: false, item: null})
    },
    getBidSum: async (req, res) => {
        const {bid, id} = req.body
        const {user} = req.session

        if (user) {
            const bids = {
                user: user.username,
                bid,
                bidTime: Date.now()
            }
            const item = await productDB.findOne({_id: id})
            if (item.bids.length > 0) {
                const refund = item.bids[item.bids.length - 1].bid
                const person = await userModel.findOne({username: item.bids[item.bids.length - 1].user})
                const refundMoney = person.money + refund
                await userModel.findOneAndUpdate({username: item.bids[item.bids.length - 1].user}, {$set: {money: refundMoney}}, {new: true})
            }
            const newMoney = user.money - bid
            await productDB.findOneAndUpdate({_id: id}, {$push: {bids}, $set: {price: bid}}, {new:true})
             const updatedUser = await userModel.findOneAndUpdate({username: user.username}, {
                $set: {money: newMoney},
                $push: {myBids: {bids, item}}
            }, {new: true})

            return res.send({success: true, message: "", bids, updatedUser})
        }
    },
    auctionHist: async (req, res) => {
        const {user} = req.session

        if (user) {
            const auction = await productDB.find({owner: user.username})
            res.send({success: true, message: "", auction})
        }
    },
    bidHist: async (req, res) => {
        const {user} = req.session

        if (user) {
            const auction = await userModel.findOne({username: user.username})
            res.send({success: true, message: "", auction})
        }
    },
    deletePost: async(req,res)=> {
        const {id} = req.body
        const {user} = req.session

        if (user) {
            await productDB.findOneAndDelete({_id: id})
            const list = await productDB.find({})
            return res.send({success: true, message: "", list})
        }
    },
    loggOut: async (req,res)=> {
        req.session.user = null
        res.send({success: true})
    }
}