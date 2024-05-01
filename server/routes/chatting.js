const express = require("express");
const router = express.Router();
const mongodb = require("../db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.post("/", async (req, res) => {
    try {
        const token = req.session.token;
        jwt.verify(token, jwtSecretKey, async (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                const userPhoneNumber = decoded.phoneNumber;
                const sentMessage = req.body.message;

                // Update sender's messages
                const updateUserData = await mongodb.updateOne({ "phoneNumber": userPhoneNumber }, {
                    $push: {
                        "messages": {
                            "timestamp": Date.now(), "type": "sent", "from": userPhoneNumber,
                            "to": req.session.toContact, "content": sentMessage
                        }
                    }
                });

                // Update receiver's messages
                let updateReceiverData;
                let receiverD   = await mongodb.findOne({ "phoneNumber": req.session.toContact });
                if (receiverD) {
                    updateReceiverData = await mongodb.updateOne({ "phoneNumber": req.session.toContact }, {
                        $push: {
                            "messages": {
                                "timestamp": Date.now(), "type": "receive", "from": userPhoneNumber,
                                "to": req.session.toContact, "content": sentMessage
                            }
                        }
                    });
                } else {
                    const insertReceiverData = await mongodb.insertOne({ "phoneNumber": req.session.toContact });
                    updateReceiverData = await mongodb.updateOne({ "phoneNumber": req.session.toContact }, {
                        $push: {
                            "messages": {
                                "timestamp": Date.now(), "type": "receive", "from": userPhoneNumber,
                                "to": req.session.toContact, "content": sentMessage
                            }
                        }
                    });
                    console.log(insertReceiverData);
                }

                console.log(updateUserData);
                const sender = await mongodb.findOne({ "phoneNumber": decoded.phoneNumber });
                let filterdata = sender.messages.filter(message => message.to === req.session.toContact || message.from === req.session.toContact);
                const receiver = req.session.toContact;
                const receiverData = await mongodb.findOne({ "phoneNumber": receiver });

                res.render(receiverData ? "chatapp2" : "chatapp", { receiver, receiverData, filterdata });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;