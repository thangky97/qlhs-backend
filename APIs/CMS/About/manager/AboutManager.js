"use strict";
const Logger = require("../../../../utils/logging");
const AboutResourceAccess = require("../resourceAccess/AboutResourceAccess");
const CommonFunctions = require("../../../Common/CommonFunctions");
const { STAFF_ROLE } = require("../../../Staff/StaffConstant");
const template = require("../../../../config/email.template");
const db = require("../../../../models");
const crypto = require("crypto");
const {
  sendMail,
  sendMailNotification,
  sendMailCloud,
} = require("../../../../services/utils");

async function findAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await AboutResourceAccess.findAll(req.query);

      if (data && data.length > 0) {
        resolve({ data });
      } else {
        resolve("failed");
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
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let addAbout = req.payload;
      let lang = addAbout.lang;
      let data = await AboutResourceAccess.findAll({ lang: lang });
      // if existing => update
      if (data && data.length > 0) {
        data = data[0];
        data = await AboutResourceAccess.updateById(data.id, addAbout);
      } else {
        //create
        data = await AboutResourceAccess.insert(addAbout);
      }
      if (data) {
        resolve(data);
      } else {
        resolve("failed");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = await AboutResourceAccess.deleteById(req.query.id);

      if (data) {
        resolve("ok");
      } else {
        reject("delete failed");
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = req.payload.data;
      let id = req.payload.id;
      let updateResult = await AboutResourceAccess.updateById(id, data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        reject("failed to update about");
      }
      return;
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await AboutResourceAccess.find({
        id: req.query.id,
        lang: req.query.lang,
      });
      if (data && data.length > 0) {
        resolve(data[0]);
      } else {
        resolve({});
      }
      return;
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function contact(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let keysPayload = Object.keys(req.payload);
      let html = template.contact.html;

      for (let i = 0; i < keysPayload.length; i++) {
        let regex = new RegExp(`{{${keysPayload[i]}}}`, "g");
        html = html.replace(regex, req.payload[keysPayload[i]]);
      }
      let setting = await db.setting.findAll();
      console.log("day la sec ting", setting[0].dataValues);
      if (setting && setting.length > 0) {
        setting = setting[0].dataValues;
      } else {
        reject("failed");
        return;
      }

      const res = await sendMail([setting.email], {
        subject: template.contact.subject,
        html: html,
      });
      if (res) {
        resolve("ok");
      } else {
        reject("failed");
      }
    } catch (error) {
      // console.error(__filename, err);
      // reject("failed")
      console.log("loi mail ne");
      console.log(error);
    }
  });
}

async function notification(req) {
  return new Promise(async (resolve, reject) => {
    const randomData = crypto.randomBytes(16);

    // Chuyển đổi buffer thành chuỗi hex
    const randomHex = randomData.toString("hex");

    try {
      let checkUser = await db.users.findOne({
        where: {
          id: req.payload.usersId,
        },
      });
      if (checkUser) {
        // resolve(checkProduct.dataValues.product_names[0].name);
        // resolve(checkUser.dataValues.email);
        // resolve(
        //   checkUser.dataValues.first_name + " " + checkUser.dataValues.last_name
        // );
        const objuserProduct = {
          email: checkUser.dataValues.email,
          token: randomHex,
          username:
            checkUser.dataValues.first_name +
            " " +
            checkUser.dataValues.last_name,
        };
        let res = await AboutResourceAccess.insert_user_token({
          ...req.payload,
          token: randomHex,
        });
        if (res) {
          let keysPayload = Object.keys(objuserProduct);
          let html = template.notification.html;

          for (let i = 0; i < keysPayload.length; i++) {
            let regex = new RegExp(`{{${keysPayload[i]}}}`, "g");
            console.log("regex", regex);
            html = html.replace(regex, objuserProduct[keysPayload[i]]);
            console.log("html", html);
          }
          let setting = await db.setting.findAll();
          if (setting && setting.length > 0) {
            setting = setting[0].dataValues;
          } else {
            reject("failed");
            return;
          }

          const res = await sendMailNotification(
            [setting.email],
            {
              subject: template.notification.subject,
              html: html,
            },
            checkUser.dataValues.email
          );
          if (res) {
            resolve("ok");
          } else {
            reject("failed");
          }
          resolve(res);
        } else {
          reject("failed");
        }
      } else {
        reject("NO_USER_OR_PRODUCT");
      }
    } catch (error) {
      // console.error(__filename, err);
      // reject("failed")
      console.log("loi mail ne");
      console.log(error);
    }
  });
}

async function cloudContact(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileCloud = req.payload.file;
      const fileName = req.payload.fileName;
      delete req.payload.file;
      let keysPayload = Object.keys(req.payload);
      let html = template.cloudContact.html;

      for (let i = 0; i < keysPayload.length; i++) {
        let regex = new RegExp(`{{${keysPayload[i]}}}`, "g");
        html = html.replace(regex, req.payload[keysPayload[i]]);
      }
      let setting = await db.setting.findAll();

      if (setting && setting.length > 0) {
        setting = setting[0].dataValues;
      } else {
        reject("failed");
        return;
      }

      const res = await sendMailCloud([setting.email], {
        subject: template.cloudContact.subject,
        html: html,
        file: fileCloud,
        fileName: fileName,
      });
      if (res) {
        resolve("ok");
      } else {
        reject("failed");
      }
    } catch (error) {
      // console.error(__filename, err);
      // reject("failed")
      console.log("loi mail ne");
      console.log(error);
    }
  });
}

async function sendpaycloud(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let keysPayload = Object.keys(req.payload);
      let html = template.sendpaycloud.html;

      for (let i = 0; i < keysPayload.length; i++) {
        let regex = new RegExp(`{{${keysPayload[i]}}}`, "g");
        html = html.replace(regex, req.payload[keysPayload[i]]);
      }
      let setting = await db.setting.findAll();
      console.log("day la sec ting", setting[0].dataValues);
      if (setting && setting.length > 0) {
        setting = setting[0].dataValues;
      } else {
        reject("failed");
        return;
      }

      const res = await sendMail([setting.email], {
        subject: template.sendpaycloud.subject,
        html: html,
      });
      if (res) {
        resolve("ok");
      } else {
        reject("failed");
      }
    } catch (error) {
      // console.error(__filename, err);
      // reject("failed")
      console.log("loi mail ne");
      console.log(error);
    }
  });
}

async function sendTokenOrderInformation(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let keysPayload = Object.keys(req.payload);
      let html = template.sendTokenOrderInformation.html;

      for (let i = 0; i < keysPayload.length; i++) {
        let regex = new RegExp(`{{${keysPayload[i]}}}`, "g");
        html = html.replace(regex, req.payload[keysPayload[i]]);
      }
      let setting = await db.setting.findAll();
      console.log("day la sec ting", setting[0].dataValues);
      if (setting && setting.length > 0) {
        setting = setting[0].dataValues;
      } else {
        reject("failed");
        return;
      }

      const res = await sendMail([setting.email], {
        subject: template.sendTokenOrderInformation.subject,
        html: html,
      });
      if (res) {
        resolve("ok");
      } else {
        reject("failed");
      }
    } catch (error) {
      // console.error(__filename, err);
      // reject("failed")
      console.log("loi mail ne");
      console.log(error);
    }
  });
}

module.exports = {
  findAll,
  insert,
  deleteById,
  updateById,
  getDetail,
  contact,
  notification,
  cloudContact,
  sendTokenOrderInformation,
  sendpaycloud,
};
