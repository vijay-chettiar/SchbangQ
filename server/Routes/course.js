const express = require("express");
const Course = require("../Modal/courseModal")
const Employee = require("../Modal/empModal")


const router = express.Router();

router.post("/add/:email", (req, res) => {
    if (req.headers.authorization) {
        try {
            Employee.find({ email: req.params.email }).then((empdata) => {
                if (empdata[0].role === "Admin") {
                    Course.create({
                        title: req.body.title,
                        description: req.body.description,
                        video_Url: req.body.video_Url,
                        topics_array: req.body.topics_array,
                        duration: req.body.duration,
                        category: req.body.category
                    }).then((data) => {
                        res.status(200).send("Course Added")
                    })

                } else {
                    res.status(403).send("Unauthrozied Employee")
                }
            })
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    } else {
        res.status(400).send("Missing Authorization Key")
    }
})

router.put("/update/:title", (req, res) => {
    if (req.headers.authorization) {
        try {
            Course.find({ title: req.params.title }).then((coursedata) => {
                if (coursedata.length) {
                    Course.updateMany({ title: req.params.title }, req.body).then((data) => {
                        if (data) {
                            res.status(200).send("Course Updated")
                        } else {
                            res.status(400).send("please input data to add in the course")
                        }
                    })
                } else {
                    res.status(400).send("Please select valid title to update the course")
                }
            })

        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    } else {
        res.status(400).send("Missing Authorization Key")
    }
})

router.delete("/delete/:title", (req, res) => {
    if (req.headers.authorization) {
        try {
            Course.find({ title: req.params.title }).then((coursedata) => {
                if (coursedata.length) {
                    Course.deleteMany({ title: req.params.title }, req.body).then((data) => {
                        if (data) {
                            res.status(200).send("Course Deleted")
                        } else {
                            res.status(400).send("please input data to delete in the course")
                        }
                    })
                } else {
                    res.status(400).send("Please select valid title to delete the course")
                }
            })

        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    } else {
        res.status(400).send("Missing Authorization Key")
    }
})

router.get("/", (req, res) => {
    Course.find().then((data) => {
        res.status(200).send(data.sort())
    })
})


module.exports = router;