"use strict";
const moduleName = "SettingMonitoring";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  Camera_ID: Joi.number(),
  Vehicle_L: Joi.number().integer(),
  Edge_ID: Joi.number(),
  Vehicle_M: Joi.number(),
  Vehicle_S: Joi.number(),
  DateTime: Joi.date().iso(),
  Note: Joi.string(),
  Intersection_ID: Joi.number(),
};

const filterSchema = {
  Intersection_name: Joi.string(),
  Service_Mapping_ID: Joi.number().required(),
};

module.exports = {
  get: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken },
    ], //
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        limit: Joi.number().default(20).max(100),
        skip: Joi.number().default(0).min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "get");
    },
  },
  delete: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken },
    ], //
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        intersection_id: Joi.number().required().integer(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "deleteSetting");
    },
  },
};
