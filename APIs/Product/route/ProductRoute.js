"use strict";
const moduleName = "Product";
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require("../../Common/CommonFunctions");

const insertSchema = {
  image: Joi.string(),
  vat: Joi.number(),
  url_ytb: Joi.string().allow(""),
  url_demo: Joi.string().allow(""),
  url_tutorial: Joi.string().allow(""),
  instructorId: Joi.number().allow(null).optional(),
  number_trial: Joi.number().required(),
  link_trial: Joi.string().allow(""),
  link_download: Joi.string().allow(""),
  status: Joi.number().valid(0, 1, 2).default(1).required(),
  product_type: Joi.number().valid(0, 1, 2, 3).default(1).required(),
  allow_display: Joi.number().valid(0, 1).default(1).required(),
  priority_index: Joi.number(),
  product_name: Joi.string().required(),
  lang: Joi.string().valid("vn", "en", "jp").required(),
  product_description: Joi.string().allow(""),
  sort_product_description: Joi.string().allow(""),
  open: Joi.number().valid(0, 1).default(0),
  is_monitor: Joi.number().valid(0, 1).required(),
};

const filterSchema = {
  status: Joi.number().valid(1, 0, 2),
  allow_display: Joi.number().valid(1, 0),
  name: Joi.string(),
  lang: Joi.string(),
  open: Joi.number().valid(0, 1),
  service_type: Joi.string().valid("local", "cloud"),
  is_monitor: Joi.number().valid(0, 1),
  product_type: Joi.number().valid(0, 1, 2, 3),
};

const updateSchema = {
  image: Joi.string(),
  url_ytb: Joi.string().allow(""),
  url_demo: Joi.string().allow(""),
  url_tutorial: Joi.string().allow(""),
  instructorId: Joi.number(),
  number_trial: Joi.number(),
  link_trial: Joi.string().allow(""),
  link_download: Joi.string().allow(""),
  vat: Joi.number(),
  priority_index: Joi.number().required(),
  allow_display: Joi.number().valid(0, 1).default(1).required(),
  status: Joi.number().valid(0, 1, 2).default(1).required(),
  product_type: Joi.number().valid(0, 1, 2, 3).default(1).required(),
  product_name: Joi.string().required(),
  lang: Joi.string().valid("vn", "en", "jp").required(),
  product_description: Joi.string().allow(""),
  sort_product_description: Joi.string().allow(""),
  open: Joi.number().valid(0, 1).default(0),
  is_monitor: Joi.number().valid(0, 1).required(),
};

const buySchema = {
  product_id: Joi.number().required(),
  phone: Joi.string().allow(""),
  user_payment: Joi.string().required(),
  service: Joi.string().valid("local", "cloud").required(),
  payment_type: Joi.string().required(),
  type: Joi.string().valid("new_order", "extend").required(),
  note: Joi.string().allow(""),
  trial_type: Joi.string().allow(""),
  startDate: Joi.string().allow(""),
  endDate: Joi.string().allow(""),
  company_name: Joi.string(),
  zip_code: Joi.string().required(),
  total_product: Joi.number().required(),
  product_type: Joi.number().required(),
  product_price_type: Joi.number().valid(0, 1, 2, 3).required(),
  email: Joi.string().allow(""),
  lang: Joi.string().required(),
  address: Joi.string().required(),
  transactionId: Joi.number(),
};

const extendSchema = {
  transactionId: Joi.number(),
  time: Joi.number().required(),
  payment_type: Joi.string().required(),
  note: Joi.string().required(),
  lang: Joi.string().required(),
};

const updateTransactionSchema = {
  transactionId: Joi.number().required(),
  price: Joi.number(),
  product_id: Joi.number(),
  time: Joi.number(),
  payment_type: Joi.string(),
  type: Joi.string().valid("new_order", "extend"),
  status: Joi.string().valid("pending", "paid", "failed"),
  discount: Joi.number(),
  payment_money: Joi.number(),
  total_money: Joi.number(),
};

module.exports = {
  find: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
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
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "find");
    },
  },
  getList: {
    tags: ["api", `${moduleName}`],
    description: `get list ${moduleName}`,
    validate: {
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.array().items(
          Joi.object({
            key: Joi.string(),
            value: Joi.string(),
          })
        ),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getList");
    },
  },
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
      payload: Joi.object(insertSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "insert");
    },
  },
  update: {
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
        id: Joi.number(),
        data: Joi.object(updateSchema),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "update");
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
  getDetailcourse: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetailcourse");
    },
  },
  getDetailusercourse: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetailusercourse");
    },
  },

  getDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetail");
    },
  },
  userGetProductDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "userGetProductDetail");
    },
  },

  getDetailuser: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyTokenOrAllowEmpty }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDetailuser");
    },
  },

  getScore: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        id: Joi.number(),
        lang: Joi.string(),
        usersId: Joi.number(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getScore");
    },
  },

  buy: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
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
      payload: Joi.array().items(buySchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "buy");
    },
  },
  buyService: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
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
        userTokenId: Joi.number().required(),
        fromdate: Joi.string().required(),
        enddate: Joi.string().required(),
        status: Joi.number().valid(0, 1, 2),
        product_id: Joi.number().required(),
        product_price_type: Joi.number().valid(0, 1, 2, 3).required(),
        lang: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "buyService");
    },
  },
  getDiscount: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        product_id: Joi.number().required(),
        time: Joi.number().required(),
        service: Joi.string().valid("local", "cloud").required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getDiscount");
    },
  },
  myService: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      query: Joi.object({
        product_id: Joi.number(),
        service: Joi.string().valid("local", "cloud"),
        status: Joi.number().valid(0, 1),
        language: Joi.string(),
        order: Joi.string().default("expiredAt DESC"),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "myService");
    },
  },
  getTransactionDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
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
      query: Joi.object({
        id: Joi.number().min(0),
        // lang: Joi.string(),
      }),
      payload: Joi.object({
        lang: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "gettransactiondetail");
    },
  },

  getTransactionCloudDetail: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
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
      query: Joi.object({
        id: Joi.number().min(0),
        // lang: Joi.string(),
      }),
      payload: Joi.object({
        lang: Joi.string(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "gettransactionclouddetail");
    },
  },

  getTransactions: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
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
      query: Joi.object({
        id: Joi.number().min(0),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "userGetTransactions");
    },
  },
  geAlltTransactions: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
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
        filter: Joi.object({
          status: Joi.string(),
          payment_type: Joi.string(),
          product_id: Joi.number(),
          user_payment: Joi.string(),
          type: Joi.number(),
          lang: Joi.string(),
        }),
        searchUser: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        order: Joi.object({
          key: Joi.string().default("id").allow(""),
          value: Joi.string().default("DESC").allow(""),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getTransactions");
    },
  },
  updateTransaction: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(updateTransactionSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "updateTransaction");
    },
  },
  extend: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(extendSchema),
    },
    handler: async function (req, res) {
      return await Response(req, res, "extend");
    },
  },

  getPrice: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        product_id: Joi.number().required(),
        service: Joi.string().valid("local", "cloud").required(),
        time: Joi.number().min(1).required(),
        type: Joi.string().valid("new_order", "extend").required(),
        lang: Joi.string().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getPrice");
    },
  },
  findDetailTransaction: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
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
      return await Response(req, res, "getDetailTransaction");
    },
  },
  checkBuy: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: "jwt",
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().required(),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "checkBuy");
    },
  },
  getAllTransactionsToken: {
    tags: ["api", `${moduleName}`],
    description: `get detail ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyStaffToken }],
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
        filter: Joi.object({
          status: Joi.string(),
          payment_type: Joi.string(),
          product_id: Joi.number(),
          user_payment: Joi.string(),
          type: Joi.number(),
          lang: Joi.string(),
        }),
        searchUser: Joi.string(),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().max(100),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        order: Joi.object({
          key: Joi.string().default("id").allow(""),
          value: Joi.string().default("DESC").allow(""),
        }),
      }),
    },
    handler: async function (req, res) {
      return await Response(req, res, "getTransactionsToken");
    },
  },
};
