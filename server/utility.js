const Employee = require("./Modal/empModal");

const checkEmailPresent = async (email) => {
    const data = await Employee.findOne({ email });
    if (data) {
        return true;
    } else {
        return false;
    }
}

module.exports = checkEmailPresent;