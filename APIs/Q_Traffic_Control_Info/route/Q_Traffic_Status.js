"use strict";
const moduleName = "QTrafficStatus";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");
const moment = require("moment");

const insertSchema = {
  Intersection_ID: Joi.number().required(),
  Camera_ID: Joi.number().required(),
  Vehicle_L: Joi.number().integer(),
  Vehicle_M: Joi.number(),
  Vehicle_S: Joi.number(),
  DateTime: Joi.date().iso().default(new Date().toISOString()),
  Note: Joi.string(),
  Client_ID: Joi.number(),
  Edge_ID: Joi.number().required(),
};

const filterSchema = {
  Intersection_ID: Joi.number().required(),
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
  getQTrafficStatus: {
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
        // monitoring_authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: filterSchema,
        limit: Joi.number().default(20).max(100),
        skip: Joi.number().default(0).min(0),
        startDate: Joi.date()
          .iso()
          .default(moment().startOf("month").toISOString()),
        endDate: Joi.date()
          .iso()
          .default(moment().endOf("month").toISOString()),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getQTrafficStatus");
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
  exportData: {
    tags: ["api", `${moduleName}`],
    description: `export ${moduleName}`,
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
        // monitoring_authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
        intersection_id: Joi.number().integer().required(),
        lang: Joi.string().valid("en", "jp", "vn").required().default("jp"),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "exportData");
    },
  },
  robotInsert: {
    tags: ["api", `${moduleName}`],
    description: `robot insert ${moduleName}`,
    validate: {
      payload: Joi.object(insertSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    },
  },
};
