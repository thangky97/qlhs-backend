const chai = require('chai');
require('dotenv').config();
const { checkResponseStatus } = require('./Common');
const Logger = require('../../../utils/logging');

async function loginStaff() {
  const body = {
    "username": "string",
    "password": "string"
  };
  return new Promise((resolve, reject) => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/staff/login`)
      .send(body)
      .end((err, res) => {
        if (err) {
          Logger.error(err);
          reject(undefined);
        }
        checkResponseStatus(res, 200);
        resolve(res.body.data);
      });
  });
}

async function loginUser(username = "string", password = "stringstring") {
  const body = {
    "username": username,
    "password": password,
  };
  return new Promise((resolve, reject) => {
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/user/login-user`)
      .send(body)
      .end((err, res) => {
        if (err) {
          Logger.error(err);
        }
        checkResponseStatus(res, 200);
        resolve(res.body.data);
      });
  });
}
module.exports = {
  loginStaff,
  loginUser
};
