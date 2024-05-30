const db = require("../models");
const ROLES = db.Roles;
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

      return Users.findOne({ emailid: req.body.emailid });
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

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkDuplicateUsername
};

module.exports = verifySignUp;
