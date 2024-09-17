"use strict";
const moduleName = "About";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../../Common/CommonFunctions");

const insertSchema = {
  about: Joi.string(),
  address_1: Joi.string(),
  address_2: Joi.string(),
  lang: Joi.string().required().valid("vn", "jp", "en"),
  section_intro_1: Joi.string(),
  section_intro_2: Joi.string(),
  section_intro_3: Joi.string(),
  section_product: Joi.string(),
  section_system: Joi.string(),
  section_service: Joi.string(),
  section_about: Joi.string(),
  section_partner: Joi.string(),
  privacy_policy: Joi.string(),
  company_name: Joi.string(),
  founded: Joi.string(),
  officer: Joi.string(),
  advisor: Joi.string(),
  terms_of_use: Joi.string(),
  faq: Joi.string(),
  my_cloud: Joi.string(),
  link_cloud: Joi.string(),
};

const updateSchema = {
  about: Joi.string(),
  address_1: Joi.string(),
  address_2: Joi.string(),
  lang: Joi.string().valid("vn", "jp", "en"),
  section_intro_1: Joi.string(),
  section_intro_2: Joi.string(),
  section_intro_3: Joi.string(),
  section_product: Joi.string(),
  section_system: Joi.string(),
  section_service: Joi.string(),
  section_about: Joi.string(),
  section_partner: Joi.string(),
  privacy_policy: Joi.string(),
  company_name: Joi.string(),
  founded: Joi.string(),
  officer: Joi.string(),
  advisor: Joi.string(),
  terms_of_use: Joi.string(),
  faq: Joi.string(),
  my_cloud: Joi.string(),
  link_cloud: Joi.string(),
  user_guide_cloud: Joi.string(),
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
        lang: Joi.string().valid("vn", "en", "jp"),
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
      payload: Joi.object({
        id: Joi.number().required(),
        data: Joi.object(updateSchema),
      }),
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
      query: Joi.object({
        id: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "deleteById");
    },
  },
  getDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    validate: {
      query: Joi.object({
        id: Joi.number().required(),
        lang: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetail");
    },
  },
  contact: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    validate: {
      payload: Joi.object({
        message: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string().required(),
        company: Joi.string().required(),
        phone: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "contact");
    },
  },
  // notification: {
  //   tags: ["api", `${moduleName}`],
  //   description: `delete ${moduleName}`,
  //   validate: {
  //     payload: Joi.object({
  //       email: Joi.string().required(),
  //       username: Joi.string().required(),
  //       productname: Joi.string().allow(""),
  //     }),
  //   },
  //   handler: async function (req, res) {
  //     return await Response(req, res, "notification");
  //   },
  // },
  notification: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    validate: {
      payload: Joi.object({
        usersId: Joi.number().required(),
        productId: Joi.number().required(""),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "notification");
    },
  },
  cloudContact: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    validate: {
      payload: Joi.object({
        userId: Joi.string().required(),
        email: Joi.string().required(),
        message: Joi.string().required(),
        title: Joi.string().required(),
        file: Joi.string(),
        fileName: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "cloudContact");
    },
  },

  sendpaycloud: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    validate: {
      payload: Joi.object({
        user_name: Joi.string().required(),
        email: Joi.string().required(),
        cloud: Joi.string().required(),
        package: Joi.string().required(),
        token: Joi.string(),
        duration: Joi.string(),
        price: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "sendpaycloud");
    },
  },

  sendTokenOrderInformation: {
    tags: ["api", `${moduleName}`],
    description: `delete ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      payload: Joi.object({
        idOrder: Joi.number().required(),
        fullName: Joi.string().required(),
        email: Joi.string(),
        phone: Joi.string(),
        address: Joi.string(),
        totalMoney: Joi.string(),
        paymentMethods: Joi.string(),
        date: Joi.string(),
        note: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "sendTokenOrderInformation");
    },
  },
};
