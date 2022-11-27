const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    video_Url: String,
    topics_array: Array,
    duration: Number,
    category: String,
    pdfs: {
        type: String,
        default: ""
    },
    videos: {
        type: String,
        default: ""
    },
    quizzes: {
        type: String,
        default: ""
    }

});

const empModal = mongoose.model("course", courseSchema);

module.exports = empModal;