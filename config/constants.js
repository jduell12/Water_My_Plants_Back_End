require("dotenv").config();

module.exports = {
  jwtSecret:
    process.env.JWT_SECRET || "super secret secret to keep it super safe!",
};
