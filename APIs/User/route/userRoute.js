"use strict";
const moduleName = "User";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  last_name: Joi.string().max(25).required(),
  first_name: Joi.string().max(25).required(),
  username: Joi.string().min(6).max(50).required(),
  email: Joi.string().max(125).email(),
  password: Joi.string().required().min(6),
  phone: Joi.string().max(25),
  codetex: Joi.string().allow(""),
  avatar: Joi.string().allow(""),
  status: Joi.number().default(1).allow(0, 1, 2),
};

const updateSchema = {
  last_name: Joi.string().max(25),
  first_name: Joi.string().max(25),
  email: Joi.string().max(125).email().allow(""),
  address: Joi.string().allow(""),
  email: Joi.string().max(125).email().allow(""),
  password: Joi.string().min(8),
  phone: Joi.string().max(25).allow(""),
  codetex: Joi.string().allow(""),
  avatar: Joi.string().allow(""),
  status: Joi.number().allow(0, 1, 2),
};

const filterSchema = {
  status: Joi.number().allow(0, 1, 2),
  username: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
};
const filterUserTokenSchema = {
  status: Joi.number().allow(0, 1, 2),
  userId: Joi.number(),
  productId: Joi.number(),
};
const filterTrainingHistorySchema = {
  status: Joi.number().allow(0, 1, 2),
  userId: Joi.number(),
  courseId: Joi.number(),
  courseName: Joi.string(),
  cloudServiceId: Joi.number(),
  training_type: Joi.number().allow(1, 2),
};
module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    },
  },
  insertTrainingHistory: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        userId: Joi.number(),
        courseId: Joi.number(),
        cloudServiceId: Joi.number().allow(null),
        training_type: Joi.number(),
        duration: Joi.number(),
        start: Joi.string(),
        end: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insertTrainingHistory");
    },
  },
  insertUsertoken: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        usersId: Joi.number().required(),
        productId: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insertUsertoken");
    },
  },
  updateTokenuser: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object({
          usersId: Joi.number().required(),
          productId: Joi.number().required(),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateTokenuser");
    },
  },
  checkExistingEmail: {
    tags: ["api", `${moduleName}`],
    description: `check email ${moduleName}`,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "checkExistingEmail");
    },
  },
  checkExistingUsername: {
    tags: ["api", `${moduleName}`],
    description: `check username ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "checkExistingUsername");
    },
  },
  checkExistingPhone: {
    tags: ["api", `${moduleName}`],
    description: `check phone ${moduleName}`,
    validate: {
      payload: Joi.object({
        phone: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "checkExistingPhone");
    },
  },
  register: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === "production") {
          // In prod, log a limited error message and throw the default Bad Request error.
          console.error("ValidationError:", err.message);
          throw Boom.badRequest(`Invalid request payload input`);
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      },
      payload: Joi.object(insertSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "register");
    },
  },
  loginUser: {
    tags: ["api", `${moduleName}`],
    description: `login user ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "loginUser");
    },
  },
  loginGoogle: {
    tags: ["api", `${moduleName}`],
    description: `login google ${moduleName}`,
    validate: {
      payload: Joi.object({
        google_id: Joi.string().required(),
        google_avatar: Joi.string().default(""),
        google_email: Joi.string().email().required(),
        google_first_name: Joi.string().default(""),
        google_last_name: Joi.string().default(""),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "loginGoogle");
    },
  },
  userUpdateInfo: {
    tags: ["api", `${moduleName}`],
    description: `update profile ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === "production") {
          // In prod, log a limited error message and throw the default Bad Request error.
          console.error("ValidationError:", err.message);
          throw Boom.badRequest(`Invalid request payload input`);
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      },
      payload: Joi.object(updateSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "userUpdateInfo");
    },
  },
  userUpdatePassword: {
    tags: ["api", `${moduleName}`],
    description: `update profile ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === "production") {
          // In prod, log a limited error message and throw the default Bad Request error.
          console.error("ValidationError:", err.message);
          throw Boom.badRequest(`Invalid request payload input`);
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      },
      payload: Joi.object({
        id: Joi.number().min(0),
        password: Joi.string().min(8),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "userUpdatePassword");
    },
  },
  updateTokendetail: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object({
          fromdate: Joi.string().required(),
          enddate: Joi.string().required(),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateTokendetail");
    },
  },
  updateTokenDetailUsageCount: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateTokenDetailUsageCount");
    },
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object({
          ...updateSchema,
          phone: Joi.string().allow(""),
          email: Joi.string().max(125).allow(""),
          status: Joi.number().default(0).allow(0, 1, 2),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateById");
    },
  },
  findUserToken: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterUserTokenSchema),
        first_name: Joi.string(),
        last_name: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "findUserToken");
    },
  },
  findTrainingHistory: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterTrainingHistorySchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "findTrainingHistory");
    },
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("DESC").allow(""),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "find");
    },
  },
  findById: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "findById");
    },
  },
  tokenDetailById: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "tokenDetailById");
    },
  },

  getTrainingHistoryDetail: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        userId: Joi.number(),
        productId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getTrainingHistoryDetail");
    },
  },

  findTokenbyid: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "findTokenbyid");
    },
  },
  removeUserToken: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "removeUserToken");
    },
  },
  removeTokenDetail: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "removeTokenDetail");
    },
  },
  forgotPassword: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "forgotPassword");
    },
  },
  changePassword: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "changePassword");
    },
  },
  getDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetailById");
    },
  },
  getUsertoken: {
    tags: ["api", `${moduleName}`],
    description: `get detail id ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getUsertoken");
    },
  },
};
