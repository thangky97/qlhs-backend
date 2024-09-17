"use strict";
const moduleName = "Intersection";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  Intersection_name: Joi.string().max(200).required(),
  Note: Joi.string().max(200),
  Status: Joi.number().valid(0, 1).default(0),
  Service_Mapping_ID: Joi.number().required(),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken },
    ],
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

  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken },
    ],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        Intersection_ID: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateById");
    },
  },
};
