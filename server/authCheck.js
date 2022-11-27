const jwt = require("jsonwebtoken");
const Employee = require("./Modal/empModal")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      try {
        if (err) {
          // console.log(err)
          return res.status(200).send({ error: "Unauthorized User!" });
        }

        const employee = await Employee.findOne({ _id: payload.id }).select(
          "-password"
        );
        req.user = employee;
        next();
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    return res.status(200).send({ error: "Forbidden operation" });
  }
};
