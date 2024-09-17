"use strict";
const moduleName = "QTrafficMedia";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  Media_URL: Joi.string().required(),
  Media_Type: Joi.string(),
  DateTime: Joi.date().iso(),
  Camera_ID: Joi.number().required(),
  Intersection_ID: Joi.number().required(),
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
      payload: Joi.object({
        imageData: Joi.binary().encoding("base64"),
        imageFormat: Joi.string().default("png"),
        intersectionId: Joi.number().required(),
        Camera_ID: Joi.number().required(),
      }),
    },
    payload: {
      maxBytes: 100 * 1024 * 1024,
      // output: 'stream',
      timeout: false,
      parse: true,
      // allow: 'multipart/form-data'
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    },
  },

  getQTrafficMedia: {
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
      }),
    },
    payload: {
      maxBytes: 100 * 1024 * 1024,
      // output: 'stream',
      timeout: false,
      parse: true,
      // allow: 'multipart/form-data'
    },
    handler: async function (req, res) {
      return await Response(req, res, "get");
    },
  },
  getHistoryInput: {
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
        filter: {
          Camera_ID: Joi.number(),
        },
        limit: Joi.number().default(20).max(100),
        skip: Joi.number().default(0).min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getHistoryInput");
    },
  },
  robotInsertMedia: {
    tags: ["api", `${moduleName}`],
    description: `${moduleName} upload media`,
    validate: {
      payload: Joi.object({
        fileData: Joi.binary().encoding("base64"),
        fileFormat: Joi.string().default("png"),
        intersectionId: Joi.number().required(),
        Camera_ID: Joi.number().required(),
      }),
    },
    payload: {
      maxBytes: 100 * 1024 * 1024,
      // output: 'stream',
      timeout: false,
      parse: true,
      // allow: 'multipart/form-data'
    },
    handler: async function (req, res) {
      return await Response(req, res, "robotInsertMedia");
    },
  },
};
