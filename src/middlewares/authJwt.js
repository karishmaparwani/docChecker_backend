const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

createToken = (payload) => {
  const { id, username, role } = payload;

  const jwtToken = jwt.sign(
    {
      userId: id,
      username,
      role,
    },
    config.secret
  );

  return jwtToken;
};

verifyToken = async (req, res, next) => {
  console.log(req.headers);
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  console.log("Initial Token: ", token)
  if (token?.startsWith("Bearer")) {
    token = token.replace("Bearer ", "");

    await jwt.verify(token, config.secret, (err, decoded) => {
      console.log(err, decoded);
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.status(400).send({
      message: "Invalid token.",
    });
  }
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  createToken,
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
