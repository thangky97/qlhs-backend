"use strict";

const StaffResourceAccess = require("./resourceAccess/StaffResourceAccess");
const { STAFF_ERROR } = require("./StaffConstant");

const crypto = require("crypto");

function hashPassword(password) {
  const hashedPassword = crypto
    .createHmac("sha256", "ThisIsStaffSecretKey")
    .update(password)
    .digest("hex");
  return hashedPassword;
}

function unhashPassword(hash) {
  const pass = cryptr.decrypt(hash);
  return pass;
}

async function verifyCredentials(username, password) {
  let hashedPassword = hashPassword(password);
  // Find an entry from the database that
  // matches either the email or username
  let verifyResult = await StaffResourceAccess.find({
    username: username,
    password: hashedPassword,
  });

  if (verifyResult && verifyResult.length > 0) {
    const staffData = verifyResult[0];
    delete staffData.password;
    return staffData;
  } else {
    throw STAFF_ERROR.USERNAME_OR_PASSWORD_NOT_MATCH;
  }
}

async function changeStaffPassword(staffData, newPassword) {
  let newHashPassword = hashPassword(newPassword);

  let result = await StaffResourceAccess.updateById(staffData.id, {
    password: newHashPassword,
  });

  if (result) {
    return result.id;
  } else {
    return undefined;
  }
}

async function createNewStaff(staffData, newPassword) {
  //check existed username
  let _existedUsers = await StaffResourceAccess.find({
    username: staffData.username,
  });
  if (_existedUsers && _existedUsers.length > 0) {
    console.log("user");
    throw STAFF_ERROR.DUPLICATED_USER;
  }

  //check existed email
  if (staffData.email) {
    _existedUsers = await StaffResourceAccess.find({ email: staffData.email });
    if (_existedUsers && _existedUsers.length > 0) {
      console.log("email");
      throw STAFF_ERROR.DUPLICATED_USER_EMAIL;
    }
  }

  //check existed phoneNumber
  if (staffData.phone) {
    _existedUsers = await StaffResourceAccess.find({ phone: staffData.phone });
    if (_existedUsers && _existedUsers.length > 0) {
      throw STAFF_ERROR.DUPLICATED_USER_PHONE;
    }
  }

  let newHashPassword = hashPassword(newPassword);

  //hash password
  staffData.password = newHashPassword;

  //create new user
  let result = await StaffResourceAccess.insert(staffData);

  if (result) {
    return result;
  } else {
    return undefined;
  }
}

async function verifyBeforeUpdate(staffId, staffData) {
  let data;
  if (staffData.email) {
    data = await StaffResourceAccess.find({
      email: staffData.email,
    });
    if (data && data.length > 0) {
      if (data[0].id !== staffId) {
        throw STAFF_ERROR.DUPLICATED_USER_EMAIL;
      }
    }
  }

  if (staffData.phone) {
    data = await StaffResourceAccess.find({
      phone: staffData.phone,
    });

    if (data && data.length > 0) {
      if (data[0].id !== staffId) {
        throw STAFF_ERROR.DUPLICATED_USER_PHONE;
      }
    }
  }

  return true;
}

module.exports = {
  verifyCredentials,
  changeStaffPassword,
  unhashPassword,
  hashPassword,
  createNewStaff,
  verifyBeforeUpdate,
};
