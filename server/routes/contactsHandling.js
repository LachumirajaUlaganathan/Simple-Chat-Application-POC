const express = require("express");
const router = express.Router();
const mongodb = require("../db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.session.token;
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.decoded = decoded;
            next();
        }
    });
};

// Add Contact route
router.post("/addContact", verifyToken, async (req, res) => {
    try {
        const userPhoneNumber = req.decoded.phoneNumber;
        const phoneNumberToAdd = req.body.phoneNumber;
        const updateData = await mongodb.updateOne({ "phoneNumber": userPhoneNumber }, { $push: { "contacts": phoneNumberToAdd } });
        console.log(updateData);
        res.redirect(`/contacts`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Chat route
router.get("/", verifyToken, async (req, res) => {
    try {
        const userPhoneNumber = req.decoded.phoneNumber;
        const user = await mongodb.findOne({ "phoneNumber": userPhoneNumber });
        const contactsList = user.contacts || [];
        const filterdata = [];
        res.render("chat", { contactsList, filterdata });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Select Contact route
router.post("/selectContact", verifyToken, async (req, res) => {
    try {
        const sender = await mongodb.findOne({ "phoneNumber": req.decoded.phoneNumber });
        const filterdata = [];
        const receiver = req.body.toContact;
        const receiverData = await mongodb.findOne({ "phoneNumber": receiver });

        if (sender.messages) {
            for (const message of sender.messages) {
                if (message.to === receiver || message.from === receiver) {
                    filterdata.push(message);
                }
            }
        }

        req.session.toContact = receiver;

        if (!receiverData) {
            res.render("chatapp", { receiver, filterdata });
        } else {
            res.render("chatapp2", { receiver, receiverData, filterdata });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;