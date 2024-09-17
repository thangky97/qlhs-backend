"use strict";
const moduleName = "QTrafficControlInfo";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");
const moment = require("moment");
const insertSchema = {
  Intersection_ID: Joi.number(),
  Edge_ID: Joi.number().required(),
  Process_ID: Joi.number().integer(),
  Process_Status: Joi.number().valid(0, 1).default(0),
  On_Off_line: Joi.number().valid(0, 1).default(0),
  Q_Traffic_Machine_ID: Joi.number(),
  Q_Machine_ID: Joi.number(),
  User_ID: Joi.number().min(0).required(),
};

const filterSchema = {
  Intersection_Name: Joi.string(),
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
  getHistoryOutput: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }], //
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
        // monitoring_authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.date()
          .iso()
          .default(moment().startOf("month").toISOString()),
        endDate: Joi.date()
          .iso()
          .default(moment().endOf("month").toISOString()),
        filter: {
          Intersection_ID: Joi.number().required(),
          Edge_ID: Joi.number().required(),
        },
        limit: Joi.number().default(20).max(100),
        skip: Joi.number().default(0).min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getHistoryOutput");
    },
  },
  get: {
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
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string().default("createdAt").allow(""),
          value: Joi.string().default("DESC").allow(""),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "get");
    },
  },
  reportError: {
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
        file_url: Joi.string(),
        description: Joi.string().required(),
        intersection_id: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "reportError");
    },
  },
};
