"use strict";
const moduleName = "Upload";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");
const Path = require("path");

module.exports = {
  uploadMediaFile: {
    tags: ["api", `${moduleName}`],
    description: `${moduleName} upload media`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
      return await Response(req, res, "uploadMediaFile");
    },
  },

  deleteFile: {
    tags: ["api", `${moduleName}`],
    description: `${moduleName} upload media`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        pathfile: Joi.any(),
      }),
    },

    handler: async function (req, res) {
      return await Response(req, res, "deleteFile");
    },
  },

  uploadMediaChunk: {
    tags: ["api", `${moduleName}`],
    description: `${moduleName} upload media`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
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
        chunk: Joi.any(),
        chunkIndex: Joi.any(),
        totalChunks: Joi.any(),
        uuId: Joi.any(),
        type: Joi.any(),
      }),
    },
    payload: {
      maxBytes: 100 * 1024 * 1024,
      // output: 'stream',
      timeout: false,
      parse: true,
      multipart: true,
      allow: [
        "application/json",
        "image/jpeg",
        "multipart/form-data",
        "application/pdf",
      ],
    },
    handler: async function (req, res) {
      return await Response(req, res, "uploadMediaChunk");
    },
  },
  getFile: {
    tags: ["api", `${moduleName}`],
    description: `get ${moduleName}`,
    handler: async function (req, h) {
      console.log(req.params.path);
      return await h.file(`uploads/${req.params.path}`);
    },
  },
  getSwaggerFile: {
    tags: ["api", `${moduleName}`],
    description: `get swagger ${moduleName}`,
    handler: async function (req, h) {
      const filePath = Path.resolve(
        __dirname,
        "../../../",
        "node_modules/swagger-ui-dist",
        req.params.path
      );
      return await h.file(filePath);
    },
  },
};
