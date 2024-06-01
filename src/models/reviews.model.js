const mongoose = require("mongoose");
const { UserSchema } = require("./users.model");

const { REVIEW_STATUS } = require("../config/constants");
const { required } = require("joi");

const ReviewerSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  reviewerEmailId: {
    type: String,
  },
  username: {
    type: String,
  },
});

ReviewerSchema.method("toJSON", function () {
  const { ...object } = this.toObject();

  object.fullname = object.firstname + " " + object.lastname;

  return object;
});

const ReviewSchema = new mongoose.Schema(
  {
    attachment_name: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: true,
    },
    relevantExp: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 50;
        },
        message: "Experience must be between 0 and 50",
      },
    },
    reasonForReview: {
      type: String,
    },
    description: {
      type: String,
    },
    docType: {
      type: String,
      required: true,
    },
    review_status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
    },
    reviewer_id: {
      type: mongoose.ObjectId,
      required: false,
      default: null,
    },
    reviewer_details: {
      type: ReviewerSchema,
      required: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
    },
    updatedBy: {
      type: mongoose.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;
