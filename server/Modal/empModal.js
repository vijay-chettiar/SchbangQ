const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: "Employee"
    }
});

const empModal = mongoose.model("employee", empSchema);

module.exports = empModal;