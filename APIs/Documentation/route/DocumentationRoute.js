"use strict";
const moduleName = "Documentation";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const filterSchema = {
  open: Joi.number().valid(0, 1),
  type: Joi.string(),
  lang: Joi.string(),
};

const createSchema = {
  image: Joi.string(),
  lang: Joi.string().required(),
  label: Joi.string().required(),
  sort_order: Joi.string().required(),
  content: Joi.string().max(3000).required(),
  short_content: Joi.string(),
  type: Joi.string().required().valid("blog", "documentation"),
  open: Joi.number().valid(0, 1).default(0),
};

const updateSchema = {
  document_id: Joi.number().required(),
  image: Joi.string(),
  lang: Joi.string(),
  label: Joi.string(),
  sort_order: Joi.string().required(),
  content: Joi.string().max(3000),
  short_content: Joi.string(),
  type: Joi.string().valid("blog", "documentation"),
  status: Joi.number(),
  open: Joi.number().valid(0, 1),
};

module.exports = {
  find: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    // pre: [
    //   { method: CommonFunctions.verifyTokenOrAllowEmpty }
    // ],
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
        language: Joi.string(),
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
      payload: Joi.object(createSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "create");
    },
  },
  update: {
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
      payload: Joi.object(updateSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "update");
    },
  },

  detail: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      // headers: Joi.object({
      //   authorization: Joi.string(),
      // }).unknown(),
      payload: Joi.object({
        document_id: Joi.number().required(),
        language: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "detail");
    },
  },
};
