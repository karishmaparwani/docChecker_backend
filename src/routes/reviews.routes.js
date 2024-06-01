// const { verifySignUp } = require("../middlewares");
const Reviews = require("../controllers/review.controller");
const verifyRole = require("../middlewares/verifyRole");
const { verifyToken } = require("../middlewares/authJwt");
const { validateBodyParams } = require("../middlewares/schemaValidator");
const { ROLES } = require("../models");
const { AddReviewSchema } = require("../jsonSchema").reviews;

const {} = require("../jsonSchema/");
module.exports = function (app) {
  app.post(
    "/api/review",
    [
      verifyToken,
      verifyRole([ROLES.CUSTOMER]),
      validateBodyParams(AddReviewSchema),
    ],
    Reviews.create
  );
};
