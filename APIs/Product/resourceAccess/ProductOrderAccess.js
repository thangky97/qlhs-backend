"use strict";
const DB = require("../../../models");
const moment = require("moment");
const { Op } = require("sequelize");
const { sendMail } = require("../../../services/utils");
const TokenFunction = require("../../ApiUtils/token");
const config = require("../../../config");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");
const tableName = "transaction";
const tableNames = "product";
async function findById(id, key) {
  const include = [
    {
      model: DB.users_product,
      as: "transaction",
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}

async function myService(language, filter, order) {
  // filter.buy_reject_delete = false;
  delete filter.order;
  return await DB.user_product.findAll({
    where: filter,
    order: [order.split(" ")],
    include: [
      {
        model: DB.product,
        required: true,
        where: {
          is_deleted: 0,
        },
        include: [
          {
            model: DB.product_name,
            required: false,
            // where: {
            //   lang: language
            // }
          },
          {
            model: DB.product_document_api,
            required: false,
            where: {
              lang: language,
            },
          },
        ],
      },
    ],
  });
}

async function getTransactions(payload) {
  var startDate = payload.filter.startDate;
  var endDate = payload.filter.endDate;
  var product_id = payload.filter.product_id;
  var searchUser = payload.filter.searchUser;
  delete payload.filter.startDate;
  delete payload.filter.endDate;
  delete payload.filter.email;
  delete payload.filter.product_id;
  delete payload.filter.searchUser;

  var filter = payload.filter;

  if (startDate && endDate) {
    filter.updatedAt = {
      [Op.and]: [
        { [Op.gte]: Date.parse(startDate) },
        { [Op.lte]: Date.parse(endDate) },
      ],
    };
  } else if (startDate) {
    filter.updatedAt = {
      [Op.gte]: Date.parse(startDate),
    };
  } else if (endDate) {
    filter.updatedAt = {
      [Op.lte]: Date.parse(endDate),
    };
  }

  var includes = [];

  let queryString = {
    where: payload.filter,
    raw: true,
    nest: true,
  };

  let queryFilterUser = {};
  if (searchUser) {
    queryFilterUser = {
      [Op.or]: [
        {
          email: {
            [Op.like]: `%${searchUser}%`,
          },
        },
        {
          username: {
            [Op.like]: `%${searchUser}%`,
          },
        },
      ],
    };
  }

  var segement_filter_product = {};
  if (product_id) segement_filter_product.id = product_id;

  includes.push({
    model: DB.users_product,
    required: true,
    include: [
      {
        model: DB.product,
        required: true,
        where: segement_filter_product,
      },
      {
        model: DB.users,
        required: true,
        attributes: ["username", "email", "first_name", "last_name"],
        where: queryFilterUser,
      },
    ],
  });

  if (includes.length > 0) queryString.include = includes;

  if (payload.limit) queryString.limit = payload.limit;
  if (payload.skip) queryString.offset = payload.skip;
  if (payload.order)
    queryString.order = [[payload.order.key, payload.order.value]];
  queryString.order = [["id", "DESC"]];
  return await DB.transaction.findAll(queryString);
}

async function updateTransaction(payload) {
  let transactionId = payload.transactionId;
  let Array_name = [];
  let productCount = 0;
  let transaction = await DB.transaction.findOne({
    where: { id: transactionId },
    include: [
      {
        model: DB.users_product,
        required: true,
        as: "user_product",
        include: [
          {
            model: DB.product,
            include: [
              {
                model: DB.product_name,
              },
            ],
          },
        ],
      },
    ],
  });
  for (const element of transaction?.user_product) {
    productCount += element?.total_product;
    Array_name.push(element?.product?.product_names[0]?.name);
  }
  if (!transaction) throw new Error("transaction not found");
  if (transaction) {
    let formattedNumber = `DH${String(
      transaction?.user_product[0]?.id
    ).padStart(5, "0")}`;
    const result = await transaction.update({
      ...payload,
    });

    if (result) {
      if (result?.dataValues?.status != "pending") {
        await sendMail([transaction?.email], {
          subject: `Cập nhật trạng thái đơn hàng`,
          html: `<tr>
              <td>
                  <table >
                      <tbody>
                          <tr>
                              <td>
                                  <p>Đơn hàng <strong>${formattedNumber}</strong> đã được cập nhật trạng thái</p>
                                  <p>Tên sản phẩm: <strong>${Array_name.join(
                                    ", "
                                  )}</strong></p>
                                  <p>Trạng thái : <strong>${
                                    payload?.status
                                  }</strong></p>
                                  <p>Tên Khách : <strong>${
                                    transaction?.user_payment
                                  }</strong><br></p>
                                  <p>Tổng số lượng: <strong>${productCount}</strong> </p>
                                  <p><br></p>

                                  <p><br>Trân trọng !</p>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>`,
        });

        await sendMail([config.EMAIL_NOREPLY], {
          subject: `CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG`,
          html: `<tr>
            <td>
                <table >
                    <tbody>
                        <tr>
                        <td>
                        <p>Đơn hàng <strong>${formattedNumber}</strong> đã được cập nhật trạng thái</p>
                        <p>Tên sản phẩm: <strong>${Array_name.join(
                          ", "
                        )}</strong></p>
                        <p>Trạng thái : <strong>${payload?.status}</strong></p>
                        <p>Tên Khách : <strong>${
                          transaction?.user_payment
                        }</strong><br></p>
                        <p>Tổng số lượng: <strong>${productCount}</strong> </p>
                        <p><br></p>

                        <p><br>Trân trọng cảm ơn!</p>
                    </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>`,
        });
      }
    }
    return transaction;
  }
}

async function userGetTransactions(payload) {
  let filter = payload.filter;
  let limit = payload.limit;
  let skip = payload.skip;
  const data = await DB.user_product.findAll({
    limit: limit,
    offset: skip,
    include: [
      {
        model: DB.transaction,
        // required: true,
        as: "transaction",
        // where: {
        //   id: filter.transaction_id,
        //   // service: filter.service,
        // },
      },
    ],
  });
  return data;
}

async function CountTransactions(filter) {
  return await DB.transaction.count({
    where: filter,
  });
}
async function userCountTransactions(filter) {
  return await DB.user_product.count({
    include: [
      {
        model: DB.transaction,
        required: true,
        as: "transaction",
        // where: {
        //   id: filter.transaction_id,
        //   // service: filter.service,
        // },
      },
    ],
  });
}

async function extend(data) {
  try {
    var user_product = await DB.transaction.findOne({
      where: { id: data.transactionId },
    });
    if (!user_product) throw new Error("Use have not this product");

    let discount = 0;

    let transaction_payload = {
      type: "extend",
      status: "pending",
      discount: discount,
      time: data.time,
      payment_type: data.payment_type,

      total_money: 0,

      price: 0,

      note: data.note,
      lang: data.lang,
    };

    let transaction = await DB.transaction.create(transaction_payload);

    return transaction.id;
  } catch (e) {
    throw e;
  }
}

async function buyService(req) {
  console.log(req, "reqs");
  try {
    const start = moment(req.fromdate);
    const end = moment(req.enddate);
    const monthDiff = end.diff(start, "months");

    const discount = 0;

    const product = await DB.product.findOne({
      where: { id: req.product_id },
    });

    const price = 0;

    const provisional = price
      ? price * monthDiff - discount >= 0
        ? price * monthDiff - discount
        : 0
      : 0;

    let userTokenDetail = await DB.userTokenDetails.findOne({
      where: {
        userTokenId: req.userTokenId,
      },
    });
    let userToken = await DB.user_tokens.findOne({
      where: {
        id: req.userTokenId,
      },
    });

    let last_price = provisional + (provisional * product.dataValues.vat) / 100;

    let transaction_payload = {
      status: last_price == 0 ? "paid" : "pending",
      user_payment: req.user.first_name + req.user.last_name,
      note: "",
      company_name: req.user.company_name || "",
      lang: req.lang,
      payment_type: "online",
      total_money: Math.floor(last_price),
      userId: req.user.id,
      type: 1,
      zip_code: "",
      email: req.user.email,
      address: req.user.address || "",
      phone: req.user.phone,
    };
    let transaction = await DB.transaction.create(transaction_payload);
    if (transaction) {
      const date = end.diff(moment(), "hour");

      let token = await TokenFunction.createTokenDetail(
        {
          created_at: start,
          time: monthDiff,
          userToken: userToken.id,
          expired_date: date + "h",
        },
        "user_token_detail"
      );
      await userToken.update({ token });
      if (userTokenDetail) {
        await DB.userTokenDetails.create({
          userTokenId: req.userTokenId,
          fromdate: start,
          enddate: end,
          productPrice: price,
          type: 1,
          status: req.status,
          transactionId: transaction.id,
          productPriceType: req.product_price_type,
        });
      } else {
        await DB.userTokenDetails.create({
          userTokenId: req.userTokenId,
          fromdate: start,
          enddate: end,
          productPrice: price,
          type: 0,
          status: req.status,
          transactionId: transaction.id,
          productPriceType: req.product_price_type,
        });
      }

      if (transaction) {
        return transaction;
      } else {
        return undefined;
      }
    }
  } catch (error) {
    throw error;
  }
}
async function buy(data) {
  let last_price = 0;
  try {
    let Array_name = [];
    let productCount = 0;

    for (let i = 0; i < data.length; i++) {
      const product_names = await DB.product_name.findOne({
        where: {
          product_id: data[i]?.product_id,
        },
      });
      Array_name.push(product_names?.name);
      productCount += data[i].total_product;
    }
    let statusPayment = "";
    if (data[0].payment_type == "online") {
      statusPayment = "paid";
    } else {
      statusPayment = "pending";
    }
    let transaction_payload = {
      status: last_price == 0 ? "paid" : statusPayment,
      transactionId: data.transactionId,
      user_payment: data.user_payment,
      note: data[0].note,
      company_name: data.company_name,
      type: 0,
      lang: data[0].lang,
      payment_type: data.payment_type,
      total_money: Math.floor(last_price),
      payment_type: data[0].payment_type,
      userId: data.userId,
      company_name: data[0].company_name,
      zip_code: data[0].zip_code,
      email: data[0].email,
      address: data[0].address,
      phone: data[0].phone,
      user_payment: data[0].user_payment,
      trial_type: data[0].trial_type,
      startDate: data[0].startDate,
      endDate: data[0].endDate,
    };

    let transaction = await DB.transaction.create(transaction_payload);
    let transactionId = transaction.id;

    for (let i = 0; i < data.length; i++) {
      let product_vat = await DB[tableNames].findOne({
        where: { id: data[i].product_id },
      });

      let exist_rejected_transaction = await DB.users_product.findOne({
        where: {
          userId: data.userId,
          product_id: data[i].product_id,
          buy_reject_delete: true,
        },
      });

      const discount = 0;
      if (exist_rejected_transaction) {
        user_product = exist_rejected_transaction.dataValues;
        await exist_rejected_transaction.update({
          buy_reject_delete: false,
          status: 0,
          email: data[i].email,
          total_product: data[i].total_product,
        });
        await exist_rejected_transaction.save();
      } else {
        let user_product_payload = {
          transactionId,
          userId: data.userId,
          product_id: data[i].product_id,
          service: data[i].service,
          discount: discount,
          vat: product_vat.dataValues.vat || 0,
          status: 0,
          price: 0,
          total_price: 0,
          total_product: data[i].total_product,
          company_name: data[i].company_name,
          zip_code: data[i].zip_code,
          email: data[i].email,
          address: data[i].address,
          phone: data[i].phone,
          user_payment: data[i].user_payment,
          lang: data[i].lang,
          product_type: product_vat.dataValues.product_type,
        };
        user_product = await DB.users_product.create(user_product_payload);
      }
    }
    if (transactionId) {
      let formattedNumber = `DH${String(transactionId).padStart(5, "0")}`;

      await sendMail([data[0]?.email], {
        subject: `ĐẶT HÀNG THÀNH CÔNG`,
        html: `<tr>
            <td>
                <table >
                    <tbody>
                        <tr>
                            <td>
                                <p>Bạn vừa nhận đặt hàng thành công sản phẩm <strong>${Array_name.join(
                                  ", "
                                )}</strong></p>
                                <p>Mã đơn hàng: <strong>${formattedNumber}</strong></p>
                                <p>Trạng thái : <strong>${statusPayment}</strong></p>
                                <p>Tên Khách : <strong>${
                                  data[0]?.user_payment
                                }</strong><br></p>
                                <p>Tổng số lượng: <strong>${productCount}</strong> </p>
                                <p><br></p>

                                <p><br>Trân trọng !</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>`,
      });

      await sendMail([config.EMAIL_NOREPLY], {
        subject: `ĐƠN HÀNG MỚI`,
        html: `<tr>
          <td>
              <table >
                  <tbody>
                      <tr>
                          <td>
                              <p>Người dùng đã tạo thành công đơn hàng <strong>${formattedNumber}</strong></p>
                              <p>Tên sản phẩm: <strong> ${Array_name.join(
                                ", "
                              )}</strong></p>
                              <p>Trạng thái : <strong>${statusPayment}</strong></p>
                              <p>Tên Khách: <strong>${
                                data[0]?.user_payment
                              }</strong><br></p>
                              <p>Tổng số lượng: <strong>${productCount} </strong></p>
                              <p><br></p>
                              <p>Thông tin chi tiết truy cập: <br><a href="https://cms.v-quantum-technology.com/apps/transaction/edit/${transactionId}">https://cms.v-quantum-technology.com/apps/transaction/edit/${transactionId}</a></p>
                              <p><br>Trân trọng cảm ơn</p>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
      </tr>`,
      });
    }
  } catch (e) {
    throw e;
  }
}

async function checkBuy(filter) {
  try {
    // id
    // userId
    var user_product = await DB.user_product.findOne({
      where: filter,
      raw: true,
    });
    if (user_product && user_product.status == 1 && user_product.token) {
      // check in db q traffic
      let token = await DB.m_token.findOne({
        where: {
          Token: user_product.token,
          Token_Expired: {
            [Op.gte]: new Date().toISOString(),
          },
        },
        raw: true,
      });
      if (!token) {
        throw new Error("Product is expired");
      }
      return true;
    } else {
      throw new Error("not found");
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  buy,
  myService,
  getTransactions,
  updateTransaction,
  extend,
  CountTransactions,
  checkBuy,
  findById,
  userGetTransactions,
  userCountTransactions,
  buyService,
};
