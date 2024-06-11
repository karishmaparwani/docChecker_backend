const ROLES = {
  ADMIN: "admin",
  EXPERT: "expert",
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

// Define possible values for domain and industry
const DOMAIN_VALUES = [
  "Product Requirement Document",
  "Resume",
  "LOR",
  "Essay"
];

const INDUSTRY_VALUES = [
  "Software",
  "Hardware",
  "Pharmaceutical",
  "Banking",
  "Consulting",
];

module.exports = {
  ROLES,
  USER_ACTIVATION_STATUS,
  DOCUMENT_TYPES,
  REVIEW_STATUS,
  DOMAIN_VALUES,
  INDUSTRY_VALUES,
};
