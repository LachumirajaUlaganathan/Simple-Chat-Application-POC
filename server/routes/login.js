const express = require("express");
const mongodb = require("../db");
const { decrypt } = require("../cipher");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const router = express.Router();
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY; 

router.get("/", (req, res) => {
    res.render("loginpage");
});

router.post("/", async (req, res) => {
    try {
        const findData = await mongodb.findOne({ "phoneNumber": req.body.phoneNumber });
        
        if (!findData) {
            return res.status(404).send("User not found");
        }
        
        const passwordMatch = decrypt(findData.password, req.body.password);
        
        if (!passwordMatch) {
            return res.status(401).send("Incorrect password");
        }
        
        const token = jwt.sign({ 
            phoneNumber: req.body.phoneNumber, 
            userName: findData.userName 
        }, jwtSecretKey, { expiresIn: '1h' });

        req.session.isLoggedIn = true;
        req.session.token = token;
        console.log(req.session);
        res.redirect(`/contacts`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
