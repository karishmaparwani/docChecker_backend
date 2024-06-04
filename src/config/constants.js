const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  CUSTOMER: "customer",
};

const USER_ACTIVATION_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

const DOCUMENT_TYPES = {
  COL_APP: "College Applicatin Essay",
  LOR: "Letter of Recommendation",
  RESUME: "Resume",
  PRD: "Product Requirement Document",
};
const REVIEW_STATUS = {
  INPROGRESS: "inProgress",
  COMPLETED: "completed",
};

module.exports = {
  ROLES,
  USER_ACTIVATION_STATUS,
  DOCUMENT_TYPES,
  REVIEW_STATUS,
};
