const Joi = require("joi");
const { REVIEW_STATUS } = require("../config/constants");

const AddReviewSchema = Joi.object({
  attachmentName: Joi.string().required(),
  attachment: Joi.string().required(),
  relevantExp: Joi.number().min(0).max(50).required(),
  reasonForReview: Joi.string().required(),
  description: Joi.string().optional(),
  docType: Joi.string().required(),
});

const GetReviewByDocId = Joi.object({
  docId: Joi.string().required().length(10),
});

const SubmitReview = Joi.object({
  docId: Joi.string().required(),
  // status: Joi.string()
  //   .valid(REVIEW_STATUS.INPROGRESS, REVIEW_STATUS.COMPLETED)
  //   .required(),
});

module.exports = {
  AddReviewSchema,
  GetReviewByDocId,
  SubmitReview,
};
