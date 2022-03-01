const express = require("express");
const router = express.Router()

router.use(express.json())

const middle = require("../middleware/main")
const {
    doRegistration,
    doLogin,
    createItem,
    getAllItems,
    getSingleItem,
    getBidSum,
    auctionHist,
    bidHist,
    deletePost,
    loggOut
} = require("../controllers/main")

router.post("/register", middle.checkRegistration, doRegistration)
router.post("/login", doLogin)
router.post("/create", middle.checkItem, createItem)
router.get("/allauctions", getAllItems)
router.get("/openItem/:id", getSingleItem)
router.post("/makeBid", middle.checkBid, getBidSum)
router.get("/auctionhistory", auctionHist)
router.get("/bidshistory", bidHist)
router.post("/delete", deletePost)
router.get("/loggout", loggOut)


module.exports = router