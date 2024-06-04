const { REVIEW_STATUS, ROLES } = require("../config/constants");
const { Reviews, Experts } = require("../models");
const experts = require("./experts.controller");

function generateUniqueKey() {
  const currentTimestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const uniqueNumber = currentTimestamp + randomNumber;

  // Modify the unique number to make it more random
  const modifiedNumber = uniqueNumber * Math.random() * 1000;

  return modifiedNumber.toString(36).slice(0, 10);
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
      attachment_name: input.attachment_name,
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
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error.message)));
  });
};

exports.create = async (req, res) => {
  findExpert()
    .then((expert) => insertReview(req.body, expert, req.user.userId))
    .then((data) => experts.update(expert, data))
    .then(([data, revData]) => res.status(201).send(revData))
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
  Reviews.find({
    createdBy: req.user.userId,
    isActive: true,
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getReviewsByModId = (req, res) => {
  Reviews.find({
    reviewerId: req.user.userId,
    isActive: true,
    // reviewStatus: { $in: req.body.review_status },
  })
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(200).send(error.message));
};

exports.getUserReviews = (req, res) => {
  if (req.user.role === ROLES.CUSTOMER)
    return this.getReviewsByCustId(req, res);

  return this.getReviewsByModId(req, res);
};

/**
 * 
 const expert = await findExpert();

 if (!expert) {
   res
     .status(200)
     .send({ message: "Reviews are currently Occupied to fullest" });
 } else {
   const expertId = expert.userId;
   const obj = {
     docId: generateUniqueKey(),
     attachment_name: req.body.attachment_name,
     attachment: req.body.attachment,
     relevantExp: req.body.relevantExp,
     reasonForReview: req.body.reasonForReview,
     description: req.body.description,
     docType: req.body.docType,
     reviewStatus: REVIEW_STATUS.INPROGRESS,
     reviewerId: expertId,
     reviewerUsername: expert.username,
   };

   obj.createdBy = obj.updatedBy = req.user.userId;

   const Review = new Reviews(obj);

   Review.save(Review)
     .then((data) => experts.update(expert, data))
     .then(([data, revData]) => res.status(201).send(revData))
     .catch((error) => res.status(400).send(error.message));
 }
 */
