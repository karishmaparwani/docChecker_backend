const { REVIEW_STATUS } = require("../config/constants");
const { Reviews } = require("../models");

exports.create = (req, res) => {
  const obj = {
    attachment_name: req.body.attachment_name,
    attachment: req.body.attachment,
    relevantExp: req.body.relevantExp,
    reasonForReview: req.body.reasonForReview,
    description: req.body.description,
    docType: req.body.docType,
    review_status: REVIEW_STATUS.INPROGRESS,
  }

  obj.createdBy = obj.updatedBy = req.user.userId;

  const Review = new Reviews(obj);
  console.log(Review);
  console.log(Review.toJSON());

  Review.save(Review)
    .then((data) => res.status(201).send(data))
    .catch((error) => {
      console.log(error);
      res.status(400).send(error.message)
    });
};
