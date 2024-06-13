const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const UserTokenCtrl = require("../controllers/userTokens.controller.js");

createToken = (payload) => {
  const { _id, username, role } = payload;

  const jwtToken = jwt.sign(
    {
      userId: _id,
      username,
      role,
      payload,
    },
    config.secret
  );

  return jwtToken;
};

verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (!token?.startsWith("Bearer")) {
    return res.status(400).send({
      message: "Invalid token.",
    });
  }

  try {
    token = token.replace("Bearer ", "");

    await jwt.verify(token, config.secret, async (err, decoded) => {
      console.log(err, decoded);
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }

      await UserTokenCtrl.isActiveToken(decoded.userId, token);
      req.user = decoded;
      next();
    });
  } catch (ex) {
    res.status(440).send(ex.message);
  }
};

isAdmin = (req, res, next) => {
  User.findById(req.user.userId).exec((err, user) => {
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
  User.findById(req.user.userId).exec((err, user) => {
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
