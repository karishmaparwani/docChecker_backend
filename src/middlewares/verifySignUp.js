const db = require("../models");
const Users = db.Users;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  Users.findOne({
    username: req.body.username,
  })
    .then((data) => {
      if (data) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }

      return Users.findOne({ emailId: req.body.emailId });
    })
    .then((data) => {
      if (data) {
        res.status(400).send({ message: "EmailId is already in use!" });
        return;
      }

      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

const checkDuplicateUsername = (req, res, next) => {
  Users.findOne({
    username: req.body.username,
  })
    .then((data) => {
      if (data) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }

      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

const checkDuplicateEmailId = (req, res, next) => {
  Users.findOne({
    emailId: req.body.emailId,
  })
    .then((data) => {
      if (data) {
        res.status(409).send({ message: "Username is already in use!" });
        return;
      }

      next();
    })
    .catch((error) => res.status(500).send({ message: error }));
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateUsername
};

module.exports = verifySignUp;
