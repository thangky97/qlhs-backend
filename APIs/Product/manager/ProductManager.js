"use strict";
const Logger = require("../../../utils/logging");
const ProductResourceAccess = require("../resourceAccess/ProductResourceAccess");
const ProductNameResourceAccess = require("../resourceAccess/ProductName");
const ProductDesResourceAccess = require("../resourceAccess/ProductDesc");
const DB = require("../../../models");

const ProductOrderResourceAccess = require("../resourceAccess/ProductOrderAccess");
const config = require("../../../config");
const { STAFF_ROLE } = require("../../Staff/StaffConstant");
const CommonFunctions = require("../../Common/CommonFunctions");
const TransactionView = require("../resourceAccess/TransactionView");

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = filter.name;

      delete filter.name;
      let data = await ProductResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await ProductResourceAccess.customCount(filter);
        resolve({ data: data, total: count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = filter.name;
      delete filter.name;
      let data = await ProductResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await ProductResourceAccess.customCount(filter);
        resolve({ data: data, total: count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let productData = req.payload;

      let maxIndex = await ProductResourceAccess.getMaxPriorityIndex();
      let data = await ProductResourceAccess.insert({
        image: productData.image,
        product_name: productData.product_name,
        url_ytb: productData.url_ytb,
        url_demo: productData.url_demo || "",
        url_tutorial: productData.url_tutorial || "",
        instructorId: productData.instructorId,
        vat: productData.vat,
        number_trial: productData.number_trial,
        link_trial: productData.link_trial,
        link_download: productData.link_download,
        product_type: productData.product_type,
        status: productData.status,
        allow_display: productData.allow_display,
        priority_index: productData.priority_index,
        open: productData.open,
        lang: productData.lang,
        is_monitor: productData.is_monitor,
        priority_index: maxIndex.max + 1,
      });
      if (data.id) {
        await ProductNameResourceAccess.insert({
          product_id: data.id,
          name: productData.product_name,
        });

        await ProductDesResourceAccess.insert({
          product_id: data.id,
          description: productData.product_description,
          sort_description: productData.sort_product_description,
          lang: productData.lang,
        });
      }
      resolve(data.id);
    } catch (e) {
      Logger.error(__filename + e);

      reject("failed");
    }
  });
}

function _buildObjectUpdate(objData) {
  let result = objData;
  let keys = Object.keys(result);
  for (let i = 0; i < keys.length; i++) {
    if (result[keys[i]] === null || result[keys[i]] === undefined) {
      delete result[keys[i]];
    }
  }

  if (Object.keys(result).length === 0) {
    return null;
  } else {
    return result;
  }
}

async function update(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let productId = req.payload.id;
      let productData = req.payload.data;
      // check existing product
      let product = await ProductResourceAccess.findById(productId, "id");
      if (!product) {
        reject("PRODUCT_NOT_FOUND");
        return;
      }

      if (
        productData.priority_index !== null &&
        productData.priority_index !== undefined
      ) {
        let existingProductIndex =
          await ProductResourceAccess.checkExistingIndex(
            productData.priority_index
          );
        if (existingProductIndex) {
          let currentDataIndex = await ProductResourceAccess.findById(
            productId
          );
          await ProductResourceAccess.updateById(existingProductIndex.id, {
            priority_index: currentDataIndex.priority_index,
          });
        }
      }
      let objData = _buildObjectUpdate({
        image: productData.image,
        vat: productData.vat,
        product_name: productData.product_name,
        url_ytb: productData.url_ytb,
        url_demo: productData.url_demo,
        url_tutorial: productData.url_tutorial,
        number_trial: productData.number_trial,
        link_trial: productData.link_trial,
        link_download: productData.link_download,
        status: productData.status,
        product_type: productData.product_type,
        instructorId: productData.instructorId,
        allow_display: productData.allow_display,
        priority_index: productData.priority_index,
        open: productData.open,
        is_monitor: productData.is_monitor,
      });
      if (objData) {
        await ProductResourceAccess.updateById(productId, objData);
      }

      // product name
      objData = _buildObjectUpdate({
        name: productData.product_name,
      });
      if (objData) {
        await ProductNameResourceAccess.findAndUpdate(
          { product_id: productId },
          objData
        );
      }

      // product description
      objData = _buildObjectUpdate({
        description: productData.product_description,
        sort_description: productData.sort_product_description,
      });

      if (objData) {
        await ProductDesResourceAccess.findAndUpdate(
          { product_id: productId, lang: productData.lang },
          { product_id: productId, lang: productData.lang, ...objData }
        );
      }

      resolve("ok");
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let productId = req.payload.id;

      await ProductNameResourceAccess.customDelete({
        product_id: productId,
      });
      await ProductDesResourceAccess.customDelete({
        product_id: productId,
      });
      await ProductResourceAccess.updateById(productId, { is_deleted: 1 });
      resolve("ok");
    } catch (err) {
      Logger.error(__filename + " " + err);
      reject("failed");
    }
  });
}

async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.customGetDetail(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function userGetProductDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.userGetProductDetail(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}
async function getDetailuser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.customGetDetailuser(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function getScore(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.customGetScores(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function getDetailcourse(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.customGetDetailcourse(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}
async function getDetailusercourse(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductResourceAccess.customGetDetailusercourse(
        req.query.id,
        req.query.lang,
        req.query.usersId || 0
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function buy(req) {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < req.payload.length; i++) {
        console.log(req.payload[i], "req.payload[i]");
        if (req.payload[i]?.trial_type == "trial") {
          let product = await DB.users_product.findOne({
            where: {
              product_id: req.payload[i].product_id,
              userId: req.currentUser.id,
              product_type: 0,
            },
            include: [
              {
                model: DB.transaction,
                required: true,
                where: {
                  trial_type: "trial",
                },
              },
            ],
          });
          console.log(product, "product");
          if (product) {
            reject("PRODUCT_TRANSACTION_EXIST");
            return;
          }
        } else {
          let product = await DB.users_product.findOne({
            where: {
              product_id: req.payload[i].product_id,
              userId: req.currentUser.id,
              product_type: 0,
            },
            include: [
              {
                model: DB.transaction,
                required: true,
                where: {
                  trial_type: null,
                },
              },
            ],
          });
          if (product) {
            reject("PRODUCT_TRANSACTION_EXIST");
            return;
          }
        }
      }
      req.payload.userId = req.currentUser.id;
      const data = await ProductOrderResourceAccess.buy(req.payload);
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function buyService(req) {
  return new Promise(async (resolve, reject) => {
    try {
      req.payload.user = req.currentUser;
      const data = await ProductOrderResourceAccess.buyService(req.payload);
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function myService(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let order = req.query.order;
      req.query.userId = req.currentUser.id;
      var language = req.query.language
        ? req.query.language
        : config.LANG_DEFAULT;
      delete req.query.language;
      const data = await ProductOrderResourceAccess.myService(
        language,
        req.query,
        order
      );
      if (data) {
        resolve(data);
      } else {
        resolve([]);
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function getTransactions(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let filter = req.payload.filter;
      let limit = req.payload.limit;
      let skip = req.payload.skip;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let order = req.payload.order;
      let searchUser = req.payload.searchUser;

      const query = limit
        ? [filter, limit, skip, startDate, endDate, order, searchUser]
        : [filter, skip, startDate, endDate, order, searchUser];

      const data = await TransactionView.find(...query);

      if (data && data.length > 0) {
        let count = await TransactionView.count(
          filter,
          startDate,
          endDate,
          searchUser
        );
        resolve({ data: data, count: count[0].count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function userGetTransactions(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ProductOrderResourceAccess.userGetTransactions(
        req.payload
      );
      if (data) {
        let count = await ProductOrderResourceAccess.userCountTransactions(
          req.payload.filter
        );
        resolve({ data: data, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function updateTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      const data = await ProductOrderResourceAccess.updateTransaction(
        req.payload
      );

      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("update transaction error " + error);
      reject("failed");
    }
  });
}

async function extend(req) {
  return new Promise(async (resolve, reject) => {
    try {
      var user_product = await DB.transaction.findOne({
        where: { id: req.payload.transactionId },
      });
      if (req.payload.lang != user_product.lang) {
        reject("WRONG_CURRENCY");
        return;
      }
      // REFUSE_EXTEND
      const data = await ProductOrderResourceAccess.extend(req.payload);
      // const data = await ProductOrderResourceAccess.extend(req.currentUser.id, req.payload);
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}
async function gettransactiondetail(req) {
  const includeData = [
    {
      model: DB.transaction,
      required: false,
    },
    {
      model: DB.users,
      required: false,
    },
    {
      model: DB.product,
      required: false,
      include: [
        {
          model: DB["product_name"],
          required: false,
        },
      ],
    },
  ];

  return new Promise(async (resolve, reject) => {
    try {
      let data;
      if (Boolean(req.payload.lang)) {
        data = await DB.users_product.findAll({
          where: {
            transactionId: req.query.id,
            lang: req.payload.lang,
          },
          include: includeData,
        });
      } else {
        data = await DB.users_product.findAll({
          where: {
            transactionId: req.query.id,
          },
          include: includeData,
        });
      }
      resolve(data);
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}

async function gettransactionclouddetail(req) {
  console.log("reqsss", req);
  return new Promise(async (resolve, reject) => {
    try {
      const data = await DB.transaction.findOne({
        where: {
          id: req.query.id,
        },
        include: [
          {
            model: DB.userTokenDetails,
            as: "userTokenDetails",
            include: [
              {
                model: DB.user_tokens,
                include: [
                  {
                    model: DB.product,
                    as: "product",
                    include: [
                      {
                        model: DB["product_name"],
                        required: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (data) {
        resolve(data);
      } else {
        resolve(0);
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

async function checkBuy(req) {
  return new Promise(async (resolve, reject) => {
    try {
      req.payload.userId = req.currentUser.id;
      const data = await ProductOrderResourceAccess.checkBuy(req.payload);
      if (data) {
        resolve(data);
      } else {
        reject("failed");
      }
    } catch (error) {
      Logger.error("check buy product error " + error);
      reject(error);
    }
  });
}

async function getDetailTransaction(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let dataTransaction = await ProductOrderResourceAccess.findById(
        req.query.id
      );
      if (dataTransaction) {
        resolve(dataTransaction);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail transaction error " + error);
      reject("failed");
    }
  });
}

async function getTransactionsToken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let filter = req.payload.filter;
      let limit = req.payload.limit;
      let skip = req.payload.skip;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let searchUser = req.payload.searchUser;

      const query = limit
        ? [filter, limit, skip, startDate, endDate, searchUser]
        : [filter, skip, startDate, endDate, searchUser];

      const data = await TransactionView.findToken(...query);

      if (data && data.length > 0) {
        let count = await TransactionView.count(
          filter,
          startDate,
          endDate,
          searchUser
        );
        resolve({ data: data, count: count[0].count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}

module.exports = {
  find,
  insert,
  update,
  deleteById,
  getDetail,
  buy,
  myService,
  getTransactions,
  updateTransaction,
  extend,
  getDetailuser,
  checkBuy,
  getDetailTransaction,
  userGetTransactions,
  getList,
  buyService,
  gettransactiondetail,
  gettransactionclouddetail,
  getTransactionsToken,
  getDetailcourse,
  getDetailusercourse,
  userGetProductDetail,
  getScore,
};
