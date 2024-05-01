const express = require("express");
const mongodb = require("../db");
const { encrypt } = require("../cipher");
const router = express.Router();

// Function to create user data object
const createUserData = (req) => {
    const encryptedText = encrypt(req.body.password);
    return {
        "isExist": true,
        "registerName": req.body.registerName,
        "userName": req.body.userName,
        "emailID": req.body.emailID,
        "phoneNumber": req.body.phoneNumber,
        "password": encryptedText,
        "gender": req.body.gender
    };
};

router.get("/", async (req, res) => {
    res.render("index");
});

router.post("/", async (req, res) => {
    try {
        const findData = await mongodb.findOne({ "phoneNumber": req.body.phoneNumber });

        console.log(req.body);
       // console.log('Encrypted:', encryptedText);

        if (!findData) {
            const userData = createUserData(req);
            const insertData = await mongodb.insertOne(userData);
            console.log('Document inserted successfully', insertData);
            res.redirect("/login");
        } else {
            if (findData.isExist === undefined) {
                const userData = createUserData(req);
                const updateData = await mongodb.updateOne({ "phoneNumber": req.body.phoneNumber }, { $set: userData });
                console.log("Document updated successfully", updateData);
                res.redirect("/login");
            } else {
                res.send("Already registered.. !");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;