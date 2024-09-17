"use strict";
const nodemailer = require("nodemailer");
const config = require("../config");
const { EMAIL } = require("../config");

let transporter = nodemailer.createTransport({
  host: EMAIL.host,
  port: EMAIL.port,
  // secure: true, // use TLS
  auth: {
    user: EMAIL.email,
    pass: EMAIL.password,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {*} address
 * @param {*} data
 */
const sendMail = async (address = [], data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!address) {
        address = "doanhbavn@gmail.com";
      }
      await transporter.sendMail({
        from: `"No Reply" <${config.EMAIL_NOREPLY}>`,
        to: address, // list of receivers
        subject: data.subject,
        html: data.html,
      });
      resolve("ok");
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const sendMailNotification = async (address = [], data, email) => {
  return new Promise(async (resolve, reject) => {
    console.log("address", address);
    console.log("day la data", data);
    console.log("config.EMAIL_NOREPLY", config.EMAIL_NOREPLY);
    try {
      if (!address) {
        address = "doanhbavn@gmail.com";
      }
      await transporter.sendMail({
        from: `"V-quantum" <${config.EMAIL_NOREPLY}>`,
        to: email, // list of receivers
        subject: data.subject,
        html: data.html,
      });
      resolve("ok");
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const sendMailCloud = async (address = [], data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!address) {
        address = ["ngothetuan27082001@gamil.com@gmail.com"];
      }
      const buffer = Buffer.from(data.file, "base64");
      await transporter.sendMail({
        from: `"No Reply" <${config.EMAIL_NOREPLY}>`,
        to: address, // list of receivers
        subject: data.subject,
        html: data.html,
        attachments: [
          {
            filename: data.fileName,
            content: buffer,
          },
        ],
      });
      resolve("ok");
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  sendMail,
  sendMailNotification,
  sendMailCloud,
};
