const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require('express-session');

dotenv.config();

const PORT = process.env.PORT;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

app.use(session({
    secret: jwtSecretKey,
    resave: false,
    saveUninitialized: true
}));


app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));

app.use(express.static('views')); //Static Files

app.use("/", require("./routes/registration"));

app.use("/login", require("./routes/login"));

app.use("/contacts", require("./routes/contactsHandling"));

app.use("/chatting", require("./routes/chatting"));


app.listen(3000, (req, res) => {
    console.log(`Server is started and Running On : ${PORT}`);
})