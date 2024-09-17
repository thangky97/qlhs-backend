"use strict";
const moduleName = "Partner";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../../Common/CommonFunctions");

const insertSchema = {
  name: Joi.string().required(),
  image: Joi.string().required(),
  priority_index: Joi.number().integer()
};

const updateSchema = {
  name: Joi.string(),
  image: Joi.string(),
  priority_index: Joi.number().integer()
};

const filterSchema = {
  name: Joi.string()
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
        skip: Joi.number().integer().default(0),
        limit: Joi.number().integer().default(20).max(100)
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
        id: Joi.number().required(),
        data: Joi.object(updateSchema)
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
