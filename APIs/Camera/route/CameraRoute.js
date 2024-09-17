"use strict";
const moduleName = 'Camera';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const insertSchema = {
  Camera_Type: Joi.string(),
  Camera_model: Joi.number().integer(),
  IP_Address: Joi.string(),
  Control_Type: Joi.number().integer(),
  SerialNumber: Joi.string(),
  Status: Joi.number().integer().valid(0, 1),
  Note: Joi.string(),
  Time_Streaming_Start: Joi.date().iso(),
  Time_Streaming_End: Joi.date().iso(),
  Intersection_ID: Joi.number().integer().required(),
  Service_Mapping_ID: Joi.number().required()
};

const updateSchema = {
  ...insertSchema
}

const filterSchema = {
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken }
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema)
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    }
  },
  deleteCamera: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken }
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        camera_id: Joi.number().integer().required()
      })
    },
    handler: async function (req, res) {
      return await Response(req, res, "deteleCamera");
    }
  },
  getCameraAvailable: {
    tags: ["api", `${moduleName}`],
    description: `get ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken }
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string()
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().integer().default(0),
        limit: Joi.number().integer().default(20).max(100)
      })
    },
    handler: async function (req, res) {
      return await Response(req, res, "getCameraAvailable");
    }
  },
  getIntersectionCamera: {
    tags: ["api", `${moduleName}`],
    description: `get ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken }
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string()
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          ...filterSchema,
          Intersection_ID: Joi.number().integer().required()
        }),
        skip: Joi.number().integer().default(0),
        limit: Joi.number().integer().default(20).max(100)
      })
    },
    handler: async function (req, res) {
      return await Response(req, res, "getIntersectionCamera");
    }
  },
  updateCamera: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [
      { method: CommonFunctions.verifyToken },
      { method: CommonFunctions.verifyMonitoringToken }
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      })
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateCamera");
    }
  }
};
