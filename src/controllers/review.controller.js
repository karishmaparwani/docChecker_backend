const { REVIEW_STATUS, ROLES } = require("../config/constants");
const { Reviews, Experts } = require("../models");
const experts = require("./experts.controller");
const mongoose = require("mongoose");
function generateUniqueKey() {
  const currentTimestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const uniqueNumber = currentTimestamp + randomNumber;

  // Modify the unique number to make it more random
  const modifiedNumber = uniqueNumber * Math.random() * 1000;

  return modifiedNumber.toString(36).slice(0, 10);
}

async function getActiveReviewsByUserWithActiveComments(
  matchingKey,
  userId = ""
) {
  try {
    const activeReviews = await Reviews.aggregate([
      // Stage 1: Match reviews with isActive: true and createdBy: userId
      {
        $match: {
          isActive: true,
          [matchingKey]: new mongoose.Types.ObjectId(userId), // Ensure userId is an ObjectId
        },
      },
      // Stage 2: Filter the comments array to include only active comments
      {
        $addFields: {
          comments: {
            $filter: {
              input: "$comments",
              as: "comment",
              cond: { $eq: ["$$comment.isActive", true] },
            },
          },
        },
      },
      // Stage 3: Optional, project only the necessary fields
      {
        $project: {
          // _id: 1,
          docId: 1,
          attachmentName: 1,
          attachment: 1,
          relevantExp: 1,
          reasonForReview: 1,
          description: 1,
          docType: 1,
          reviewStatus: 1,
          reviewerId: 1,
          reviewerUsername: 1,
          comments: 1,
          // isActive: 1,
          createdBy: 1,
          updatedBy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return activeReviews;
  } catch (error) {
    console.error(
      "Error fetching active reviews by user with active comments:",
      error
    );
    throw error;
  }
}

async function findExpert(pendingCount = 0) {
  try {
    const experts = await Experts.aggregate([
      { $match: { pending: pendingCount } },
      { $sort: { createdAt: 1 } },
      { $sample: { size: 1 } },
    ]);

    if (pendingCount >= 5) {
      throw new Error("Reviewers are currently Occupied to fullest");
    } else if (experts.length > 0) {
      return experts[0];
    } else {
      return await findExpert(pendingCount + 1);
    }
  } catch (error) {
    throw error;
  }
}

const insertReview = (input, expert, reqUserId) => {
  return new Promise((resolve, reject) => {
    const obj = {
      docId: generateUniqueKey(),
      attachmentName: input.attachmentName,
      attachment: input.attachment,
      relevantExp: input.relevantExp,
      reasonForReview: input.reasonForReview,
      description: input.description,
      docType: input.docType,
      reviewStatus: REVIEW_STATUS.INPROGRESS,
      reviewerId: expert.userId,
      reviewerUsername: expert.username,
    };

    obj.createdBy = obj.updatedBy = reqUserId;

    const Review = new Reviews(obj);

    Review.save(Review)
      .then((data) => resolve([data, expert]))
      .catch((error) => reject(new Error(error.message)));
  });
};

exports.createReview = async (req, res) => {
  findExpert()
    .then((expert) => insertReview(req.body, expert, req.user.userId))
    .then(([data, expert]) => experts.update(expert, data))
    .then(([data, reviewData]) => res.status(201).send(reviewData))
    .catch((error) => res.status(400).send(error.message));
};

exports.getReviewByDocId = (req, res) => {
  Reviews.findOne({
    docId: req.params.docId,
  })
    .then((data) => res.status(200).send(data.toJSON()))
    .catch((error) => res.status(400).send({ message: error.message }));
};

exports.submitReview = (req, res) => {
  Reviews.findOneAndUpdate(
    {
      docId: req.body.docId,
      reviewerId: req.user.userId,
      reviewStatus: REVIEW_STATUS.INPROGRESS,
    },
    {
      $set: {
        reviewStatus: REVIEW_STATUS.COMPLETED,
        updatedBy: req.user.userId,
      },
    },
    { new: true, runValidators: true, findOneAndModify: false }
  )
    .then((data) => experts.reviewSubmitted(req.user.userId, data))
    .then(([expert, revData]) => res.status(200).send(revData))
    .catch((error) => res.status(400).send({ message: error.message }));
};

exports.getReviewsByCustId = (req, res) => {
  getActiveReviewsByUserWithActiveComments("createdBy", req.user.userId)
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getReviewsByModId = (req, res) => {
  getActiveReviewsByUserWithActiveComments("reviewerId", req.user.userId)
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getUserReviews = (req, res) => {
  if (req.user.role === ROLES.CUSTOMER)
    return this.getReviewsByCustId(req, res);

  return this.getReviewsByModId(req, res);
};
