"use strict";
const moduleName = "Slider";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../../Common/CommonFunctions");

const insertSchema = {
  title: Joi.string().max(3000),
  content: Joi.string().max(3000),
  lang: Joi.string().required(),
  image: Joi.string().required().max(3000),
  url: Joi.string().max(3000),
  priority_index: Joi.number().integer()
};

const updateSchema = {
  title: Joi.string().max(3000),
  content: Joi.string().max(3000),
  lang: Joi.string().required(),
  image: Joi.string().max(3000),
  url: Joi.string().max(3000),
  priority_index: Joi.number().integer()
};

const filterSchema = {
  title: Joi.string(),
  content: Joi.string(),
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
      payload: Joi.object(insertSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    },
  },
  getAll: {
    tags: ["api", `${moduleName}`],
    description: `get all ${moduleName}`,
    validate: {
      query: Joi.object({
        lang: Joi.string().valid('vn', 'en', 'jp')
      })
    },
    handler: async function (req, res) {
      return await Response(req, res, "findAll");
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
      payload: Joi.object({
        filter: Joi.object(filterSchema),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "find");
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
      query: Joi.object({
        id: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "deleteById");
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
        id: Joi.number().required(),
        data: Joi.object(updateSchema),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateById");
    },
  },
  getDetail: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    validate: {
      query: Joi.object({
        id: Joi.number().required()
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetailById");
    },
  },
};
