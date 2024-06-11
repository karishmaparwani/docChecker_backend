const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { authJwt } = require("../middlewares/index");
const { USER_ACTIVATION_STATUS } = require("../config/constants");
const ExpertsController = require("./experts.controller");
const { ROLES } = require("../config/constants");

function hashPassword(pwd) {
  return bcrypt.hashSync(pwd, 8);
}

function isValidPassword(pwd, hash) {
  return bcrypt.compareSync(pwd, hash);
}

const findAll = (req, res) => {
  const input = {
    role: ROLES.EXPERT,
  };

  if (req.query.status) {
    input["isActive"] = {
      status: req.query.status,
    };
  }

  if (req.query.actStatus) {
    input["activationStatus.status"] = req.query.actStatus;
  }

  Users.find(input)
    .select("-password -_id") // Exclude the password field
    .then((data) => {
      res.status(200).send({
        total: data.length,
        data,
      });
    })
    .catch((e) => {
      res.status(400).send(e.message);
    });
};

const login = (req, res) => {
  Users.findOne({
    username: req.body.username,
    isActive: true,
  })
    .select("-_id -isActive -createdAt -updatedAt -profile._id")
    .then((data) => {
      if (!data) {
        res.status(404).send("User Not Found");
      } else {
        if (isValidPassword(req.body.password, data.password)) {
          data = data.toJSON();
          data.accessToken = authJwt.createToken(data);

          delete data.password;

          return res.status(200).send(data);
        }

        res.status(401).send({ message: "UNAUTHORIZED" });
      }
    })
    .catch((e) => res.status(400).send(e.message));
};

const expertSignUp = (req, res) => {
  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    emailId: req.body.emailId,
    password: hashPassword(req.body.password),
    role: ROLES.EXPERT,
    profile: { ...req.body.profile },
  });

  Users.findOne({ username: User.get("username") })
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
  const User = new Users({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: hashPassword(req.body.password),
    emailId: req.body.emailId,
    role: ROLES.CUSTOMER,
  });

  Users.findOne({ username: User.get("username") })
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
    },
    {
      new: true,
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
    { username: req.params.username },
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

const updateUserStatus = (req, res) => {
  const { username } = req.params;
  let { userId, status, message } = req.body;
  let isActive = false;

  if (status.toLowerCase() === USER_ACTIVATION_STATUS.APPROVED) {
    status = USER_ACTIVATION_STATUS.APPROVED;
    isActive = true;
  } else status = USER_ACTIVATION_STATUS.REJECTED;

  Users.updateOne(
    { username },
    {
      activationStatus: {
        status,
        message,
      },
      isActive,
    },
    { new: true }
  )
    .then(() => {
      if (status === USER_ACTIVATION_STATUS.REJECTED) return;

      return ExpertsController.create(userId, username);
    })
    .then((data) =>
      res.status(201).send({
        message: `User ${
          status.charAt(0).toUpperCase() + status.slice(1)
        } Successfully`,
      })
    )
    .catch((error) => res.status(400).send({ message: error.message }));
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
exports.updateUserStatus = updateUserStatus;
exports.deleteUser = deleteUser;
