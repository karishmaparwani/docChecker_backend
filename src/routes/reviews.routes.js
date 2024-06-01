// const { verifySignUp } = require("../middlewares");
const Reviews = require("../controllers/review.controller");
const verifyRole = require("../middlewares/verifyRole");
const { verifyToken } = require("../middlewares/authJwt");
const { validateBodyParams, validatePathParams } = require("../middlewares/schemaValidator");
const { ROLES } = require("../config/constants");
const { AddReviewSchema, GetReviewByDocId } = require("../jsonSchema").reviews;

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
 
  app.get(
    "/api/review/:docId",
    [
      verifyToken,
      verifyRole([ROLES.MODERATOR, ROLES.CUSTOMER]),
      validatePathParams(GetReviewByDocId),
    ],
    Reviews.getReviewByDocId
  );

  app.get(
    "/api/user/reviews",
    [
      verifyToken,
      verifyRole([ROLES.MODERATOR, ROLES.CUSTOMER]),
    ],
    Reviews.getUserReviews
  );
};
