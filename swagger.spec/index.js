const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "REST API for DocChecker", // Title of the documentation
    version: "1.0.0", // Version of the app
    description: "This is the REST API for DocChecker Backend Services", // short description of the app
  },
  servers: [
    {
      url: "http://localhost:8090/api",
      description: "Local server",
    },
    // {
    //   url: "https://backend.zepul.com/api",
    //   description: "Live server",
    // },
    // {
    //   url: "http://192.168.0.122:8081/api",
    //   description: "Testing server",
    // },
  ],

  tags: [
    {
      name: "Login",
      description: "All User Login",
    },
    {
      name: "Sign In",
      description: "All User Signup to DocChecker",
    },
    {
      name: "User Profile",
      description: "All User Signup to DocChecker",
    },
    {
      name: "Customer",
      description: "Customer API's",
    },
    {
      name: "Moderator",
      description: "Moderator API's",
    },
    {
      name: "Admin",
      description: "Admin API's",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        name: "Authorization",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./**/*.yaml"],
};

// initialize swagger-jsdoc
exports.swaggerSpec = swaggerJSDoc(options);
