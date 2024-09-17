const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const { checkResponseStatus } = require("../../Common/test/Common");
const TestFunctions = require("../../Common/test/CommonTestFunctions");
require("dotenv").config();
var crypto = require("crypto");

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

/**
 * register user
 * login staff
 * create new product
 * buy product
 * approve transaction
 * check sync data
 */

let staffToken = "";
let userToken = "";
let productId;
let transactionId;
let userProductId;
let extendProductTransactionId;
describe(`Test product`, () => {
  before((done) => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      resolve();
    }).then(() => done());
  });

  it("register user", (done) => {
    const body = {
      last_name: faker.name.lastName(),
      first_name: faker.name.firstName(),
      username: "user" + crypto.randomBytes(5).toString("hex"),
      password: "string",
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber() + crypto.randomBytes(1).toString("hex"),
      avatar: faker.image.avatar(),
      status: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/user/register`)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        userToken = `Bearer ${res.body.data.token}`;
        done();
      });
  });

  it("create product", (done) => {
    const body = {
      image: "string",
      link_trial: "string",
      link_download: "string",
      link_document_api: "string",
      status: 1,
      product_name: "string",
      lang: "vn",
      product_description: "string",
      service_price_local: 120,
      service_price_cloud: 1230,
      open: 1,
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/product/insert`)
      .set("Authorization", staffToken)
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        productId = res.body.data;
        done();
      });
  });

  it("buy product", (done) => {
    const body = {
      product_id: productId,
      time: 4,
      service: "local",
      payment_type: "paypal",
      type: "new_order",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/product/buy`)
      .set("Authorization", userToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        transactionId = res.body.data;
        done();
      });
  });

  it("approve transaction", (done) => {
    const body = {
      transactionId: transactionId,
      status: "paid",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .put(`/product/transactions`)
      .set("Authorization", staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  // it('find user product id', done => {
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .get(`/product/find-detail-transaction?id=${transactionId}`)
  //     .set("Authorization", userToken)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       userProductId = res.body.data.user_product_id;
  //       done();
  //     });
  // });

  // it('extend product', done => {
  //   const body = {
  //     "user_product_id": userProductId,
  //     "time": 1,
  //     "payment_type": "paypal"
  //   };
  //   chai
  //     .request(`0.0.0.0:${process.env.PORT}`)
  //     .post(`/product/extend`)
  //     .set("Authorization", userToken)
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       checkResponseStatus(res, 200);
  //       extendProductTransactionId = res.body.data;
  //       done();
  //     });
  // });

  it("approve transaction", (done) => {
    const body = {
      transactionId: extendProductTransactionId,
      status: "paid",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .put(`/product/transactions`)
      .set("Authorization", staffToken)
      .send(body)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
});
