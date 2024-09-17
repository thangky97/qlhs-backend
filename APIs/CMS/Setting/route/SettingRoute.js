"use strict";
const moduleName = "Setting";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../../Common/CommonFunctions");

const insertSchema = {
  logo: Joi.string().required(),
  phone_1: Joi.string(),
  phone_2: Joi.string(),
  footer_text: Joi.string().max(3000),
  map_source: Joi.string().max(3000),
  email: Joi.string().email()
};

const updateSchema = {
  logo: Joi.string(),
  phone_1: Joi.string(),
  phone_2: Joi.string(),
  footer_text: Joi.string().max(255),
  map_source: Joi.string().max(3000),
  email: Joi.string().email()
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
    // pre: [{ method: CommonFunctions.verifyStaffToken }],
    // auth: {
    //   strategy: "jwt",
    // },
    validate: {
      // headers: Joi.object({
      //   authorization: Joi.string(),
      // }).unknown(),
      query: Joi.object({
        key: Joi.string().default("id").allow(""),
        value: Joi.string().default("DESC").allow(""),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "findAll");
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
      payload: Joi.object(updateSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateById");
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
      return await Response(req, res, "deleteById");
    },
  },
};
