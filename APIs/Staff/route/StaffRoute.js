"use strict";
const moduleName = "Staff";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  last_name: Joi.string().max(25).required(),
  first_name: Joi.string().max(25).required(),
  username: Joi.string().alphanum().min(6).max(25).required(),
  email: Joi.string().email().max(125).required(),
  password: Joi.string().required(),
  phone: Joi.string().max(25).required(),
  status: Joi.number().valid(0, 1, 2).default(1),
  role: Joi.string(),
};

const updateSchema = {
  last_name: Joi.string(),
  first_name: Joi.string(),
  phone: Joi.string(),
  role: Joi.string(),
  email: Joi.string().email(),
  status: Joi.number().valid(0, 1, 2),
  role: Joi.string(),
};

const filterSchema = {
  last_name: Joi.string(),
  first_name: Joi.string(),
  phone: Joi.string(),
  // role: Joi.string(),
  role: Joi.alternatives().try(
    Joi.string(), // Cho phép role là một chuỗi
    Joi.array().items(Joi.string()) // Hoặc là một mảng các chuỗi
  ),
  email: Joi.string().email(),
  status: Joi.number().valid(0, 1, 2),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        ...insertSchema,
        roleId: Joi.number().default(2).not(1),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
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
        data: Joi.object(updateSchema),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateById");
    },
  },
  find: {
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
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("desc").allow(""),
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
  loginStaff: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
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
      payload: Joi.object({
        username: Joi.string().alphanum().min(6).max(30).required(),
        password: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "loginStaff");
    },
  },
  registerStaff: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...insertSchema,
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "registerStaff");
    },
  },
  resetPasswordStaff: {
    tags: ["api", `${moduleName}`],
    description: `reset password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "resetPasswordStaff");
    },
  },
  changePasswordStaff: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        newPassword: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "changePasswordStaff");
    },
  },
  adminChangePasswordStaff: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required(),
        newPassword: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "adminChangePasswordStaff");
    },
  },

  deleteById: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "deleteStaffById");
    },
  },
  changePasswordUserStaff: {
    tags: ["api", `${moduleName}`],
    description: `change password User${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        appUserId: Joi.number().required(),
        newPassword: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "changePasswordUserOfStaff");
    },
  },
};
