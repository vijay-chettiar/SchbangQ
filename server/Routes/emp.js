const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../Modal/empModal")

const authCheck = require("../authCheck")
const checkEmailPresent = require("../utility");

const router = express.Router();

router.post("/signup", async (req, res) => {

    const { name, email, password, role } = req.body;

    if (!name, !email, !password) {
        return res.status(400).send({ error: "Please enter all the required fields." });
    }

    const emailValidation =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailValidation.test(email)) {
        return res.status(400).send({ error: "Please enter a valid email." });
    }

    if (password.length < 6) {
        return res.status(400).send({ error: "Password length should be minimum 6." });
    }

    try {
        let emailPresent = await checkEmailPresent(email);
        if (emailPresent) {
            res.status(400).send({ error: "This email already exists, try using any other email." });
        } else {
            const salt = bcrypt.genSaltSync(parseFloat(process.env.SALT));
            const passwordHash = bcrypt.hashSync(password, salt);

            let empData = await Employee.create({ name, email, password: passwordHash, role });
            res.status(200).send("Employee Added");
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ error: error.message });
    }
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email, !password) {
        return res.status(400).send({ error: "Please enter all the required fields." });
    }

    const emailValidation =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailValidation.test(email)) {
        return res.status(400).send({ error: "Please enter a valid email." });
    }
    try {
        let emailPresent = await Employee.findOne({ email });
        console.log(emailPresent._id)
        if (!emailPresent) {
            res.status(400).send({ error: "Please enter correct email." });
        } else {
            const isPasswordMatched = bcrypt.compareSync(password, emailPresent.password);

            if (!isPasswordMatched) {
                res.status(400).send({ error: "Incorrect password." });
            } else {
                const payload = { id: emailPresent._id }
                const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
                const user = { ...emailPresent._doc, password: undefined };
                res.status(200).send({ token });
            }
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put("/role/:email", (req, res) => {
    try {
        Employee.find({ email: req.params.email }).then((email) => {
            if (email.length) {
                Employee.updateOne({ email: req.params.email }, req.body).then((role) => {
                    res.status(200).send("Role Updated")
                })
            } else {
                res.status(400).send("Please select a valid person")
            }
        })
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/check", authCheck, async (req, res) => {
    return res.status(200).send({ ...req.user._doc });
});

module.exports = router;
