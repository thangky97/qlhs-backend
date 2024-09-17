"use strict";
const UserProductView = require("../resourceAccess/UserProductView");
const UserProductResourceAccess = require("../resourceAccess/UserProductResourceAccess");
const Logger = require("../../../utils/logging");
const DB = require("../../../models");

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await DB.users_product.findAll({
        where: {
          userId: req.query.id,
        },
        include: [
          // {
          //   model: DB["transaction"],
          //   as: "transaction",
          //   required: false,
          // },
          {
            model: DB["transaction"],
            as: "transaction",
            required: true, // Chỉ lấy những user_product có mối quan hệ với transaction
            where: {
              [DB.Sequelize.Op.or]: [
                { endDate: { [DB.Sequelize.Op.gt]: new Date() } }, // Lấy những transaction có endDate lớn hơn thời gian hiện tại
                { endDate: null }, // Lấy những transaction có endDate là null
              ],
            },
          },
          {
            model: DB["product"],
            as: "product",
            required: false,
            include: [
              {
                model: DB["product_name"],
                required: false,
              },
              {
                model: DB["product_description"],
                required: false,
              },
              {
                model: DB["instructors"],
                required: false,
              },
              {
                model: DB["curriculum_sections"],
                as: "sections",
                where: {
                  status: 1,
                },
                required: false,
              },
              {
                model: DB["usersectionprogress"],
                as: "usersectionprogress",
                where: {
                  usersId: req.query.id,
                },
                required: false,
              },
            ],
          },
        ],
      });
      console.log("day la data", data);
      resolve(data);
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}
async function userFind(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await DB.users_product.findAll({
        where: {
          userId: req.query.id,
        },
        include: [
          {
            model: DB["transaction"],
            as: "transaction",
            required: false,
          },
          {
            model: DB["product"],
            as: "product",
            required: false,
            include: [
              {
                model: DB["usersectionprogress"],
                as: "usersectionprogress",
                where: {
                  usersId: req.query.id,
                },
                required: false,
              },
            ],
          },
        ],
      });
      console.log("day la data", data);
      resolve(data);
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}
async function findAlls(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let data = await UserProductView.customFind(filter, skip, limit, order);
      if (data && data.length > 0) {
        resolve({ data: data });
      } else {
        resolve({ data: [] });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = await UserProductView.findById(id);
      console.log(data);
      if (data && data.length > 0) {
        resolve(data[0]);
      } else {
        resolve({});
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;
      let res = await UserProductResourceAccess.updateById(id, data);
      if (res) {
        if (data.expiredAt) {
          let item = await UserProductResourceAccess.findById(id);
          await DB.m_token.update(
            { Token_Expired: data.expiredAt },
            {
              where: { Token: item.token },
            }
          );
        }
        resolve(res);
      } else {
        reject("failed");
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let res = await UserProductResourceAccess.deleteById(id);
      if (res) {
        resolve(res);
      } else {
        reject("failed");
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

module.exports = {
  find,
  findById,
  updateById,
  deleteById,
  findAlls,
  userFind,
};
