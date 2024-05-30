const { Users, Roles: ROLES } = require("../models");
// const { generateToken } = require('../utils/token');
var bcrypt = require("bcryptjs");
const { authJwt } = require("../middlewares/index");
const findAll = (req, res) => {
  Users.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(400).send(e.message);
    });
};

const login = (req, res) => {
  console.log("Input: ", req.body);
  if (!req.body.username) {
    return res.status(400).send("Username not found");
  }

  Users.findOne({
    username: req.body.username,
  })
    .then((data) => {
      if (!data) {
        res.status(200).send("User Not Found");
      } else {
        // Convert Mongoose document to plain JavaScript object
        const resp = data.toJSON();
        const token = authJwt.createToken(data);

        resp["accessToken"] = token;
        res.status(200).send(resp);
      }
    })
    .catch((e) => res.status(400).send(e.message));
};

const expertSignUp = (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing fields");
  }

  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    emailId: req.body.emailId,
    password: bcrypt.hashSync(req.body.password, 8),
    role: ROLES.MODERATOR,
    profileSummary: req.body.profileSummary,
    linkedInUrl: req.body.linkedInUrl,
    yearsOfExperience: req.body.yearsOfExperience,
    domainOfExpertise: req.body.domainOfExpertise,
    industry: req.body.industry,
  });

  Users.findOne({ username: username })
    .then((userData) => {
      if (userData) {
        throw new Error("Username already exists");
      }

      // return data to next execution or next then method
      return User.save(User);
    })
    .then((data) => res.status(201).send(data))
    .catch((error) => res.status(400).send(error.message));
};

const signUp = (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing fields");
  }

  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    role: ROLES.CUSTOMER,
    emailId: req.body.emailId,
  });

  Users.findOne({ username: username })
    .then((userData) => {
      if (userData) {
        throw new Error("Username already exists");
      }

      // return data to next execution or next then method
      return User.save(User);
    })
    .then((data) => res.status(201).send(data))
    .catch((error) => res.status(400).send(error.message));
};

const signOut = (req, res) => {
  res.status(200).send("loggedOut");
};

const updateProfile = (req, res) => {
  Users.updateOne(
    { username: req.params.username },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      profile: {
        profileSummary: req.body.profileSummary,
        linkedInUrl: req.body.linkedInUrl,
        yearsOfExperience: req.body.yearsOfExperience,
        domainOfExpertise: req.body.domainOfExpertise,
        industry: req.body.industry,
      },
    }
  )
    .then((data) => {
      if (data.acknowledged) {
        res.status(200).send({
          message: "Record Updated Successfully",
          data,
        });
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const updateUserName = (req, res) => {
  Users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        email: req.body.username,
      },
      select: "emailId",
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) =>
      res.status(200).send({
        message: "Username Updated Successfully",
        data,
      })
    )
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteUser = (req, res) => {
  Users.findOneAndUpdate(
    { username: username },
    {
      $set: {
        isActive: false,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => {
      if (data.acknowledged) {
        res.status(200).send({
          message: "User Deleted Successfully",
        });
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const updatePassword = (req, res) => {};

const updateResume = (req, res) => {};

exports.findAll = findAll;
exports.login = login;
exports.expertSignUp = expertSignUp;
exports.signUp = signUp;
exports.signOut = signOut;
exports.updateProfile = updateProfile;
exports.updateUserName = updateUserName;
exports.deleteUser = deleteUser;
