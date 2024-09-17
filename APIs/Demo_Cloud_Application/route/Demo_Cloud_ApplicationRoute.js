"use strict";
const moduleName = "Demo_Cloud_Applications";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  short_description: Joi.string(),
  long_description: Joi.string(),
  image: Joi.string(),
  lang: Joi.string(),
  demo_url: Joi.string(),
  sample_code: Joi.string(),
  priority_index: Joi.number(),
};

const updateSchema = {
  short_description: Joi.string(),
  long_description: Joi.string(),
  image: Joi.string(),
  lang: Joi.string(),
  sample_code: Joi.string(),
  demo_url: Joi.string(),
  priority_index: Joi.number(),
};

const filterSchema = {
  lang: Joi.string(),
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
  getList: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getList");
    },
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `find ${moduleName}`,
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
        limit: Joi.number().default(20).max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
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
  getDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetail");
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
        id: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "deleteById");
    },
  },
};
