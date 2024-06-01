const { REVIEW_STATUS, ROLES } = require("../config/constants");
const { Reviews } = require("../models");

function generateUniqueKey() {
  const currentTimestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const uniqueNumber = currentTimestamp + randomNumber;

  // Modify the unique number to make it more random
  const modifiedNumber = uniqueNumber * Math.random() * 1000;

  return modifiedNumber.toString(36).slice(0, 10);
}

exports.create = (req, res) => {
  const obj = {
    docId: generateUniqueKey(),
    attachment_name: req.body.attachment_name,
    attachment: req.body.attachment,
    relevantExp: req.body.relevantExp,
    reasonForReview: req.body.reasonForReview,
    description: req.body.description,
    docType: req.body.docType,
    review_status: REVIEW_STATUS.INPROGRESS,
  };

  obj.createdBy = obj.updatedBy = req.user.userId;

  const Review = new Reviews(obj);

  Review.save(Review)
    .then((data) => res.status(201).send(data))
    .catch((error) => {
      console.log(error);
      res.status(400).send(error.message);
    });
};

exports.getReviewByDocId = (req, res) => {
  Reviews.findOne({
    docId: req.params.docId,
  })
    .then((data) => res.status(200).send(data.toJSON()))
    .catch((error) => res.status(400).send({ message: error.message }));
};

exports.getReviewsByCustId = (req, res) => {
  Reviews.find({
    createdBy: req.user.userId,
    isActive: true,
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getReviewsByModId = (req, res) => {
  Reviews.find({
    reviewer_id: req.user.userId,
    isActive: true,
    review_status: { $in: req.body.review_status },
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getUserReviews = (req, res) => {
  if (req.user.role === ROLES.CUSTOMER) return this.getReviewsByCustId();

  return this.getReviewsByModId();
};

exports.getUserReviews = (req, res) => {
  if (req.user.role === ROLES.CUSTOMER) return this.getReviewsByCustId(req, res);

  return this.getReviewsByModId(req, res);
};
