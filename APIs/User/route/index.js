const UserRoute = require("./userRoute");

module.exports = [
  {
    method: "POST",
    path: "/user/check-existing-email",
    options: UserRoute.checkExistingEmail,
  },
  { method: "POST", path: "/user/register", options: UserRoute.register },
  {
    method: "POST",
    path: "/user/check-existing-phone",
    options: UserRoute.checkExistingPhone,
  },
  {
    method: "POST",
    path: "/user/check-existing-username",
    options: UserRoute.checkExistingUsername,
  },
  { method: "POST", path: "/user/login-user", options: UserRoute.loginUser },
  {
    method: "POST",
    path: "/user/login-google",
    options: UserRoute.loginGoogle,
  },
  {
    method: "POST",
    path: "/user/user-update-info",
    options: UserRoute.userUpdateInfo,
  },
  {
    method: "POST",
    path: "/user/user-update-password",
    options: UserRoute.userUpdatePassword,
  },
  { method: "GET", path: "/user/get-detail", options: UserRoute.getDetail },
  {
    method: "POST",
    path: "/user/get-usertoken",
    options: UserRoute.getUsertoken,
  },
  {
    method: "POST",
    path: "/user/insert-usertoken",
    options: UserRoute.insertUsertoken,
  },
  {
    method: "POST",
    path: "/user/update-usertoken",
    options: UserRoute.updateTokenuser,
  },
  {
    method: "DELETE",
    path: "/user/usertoken-get-detail",
    options: UserRoute.findTokenbyid,
  },
  {
    method: "POST",
    path: "/user/usertoken-delete",
    options: UserRoute.removeUserToken,
  },
  {
    method: "POST",
    path: "/user/forgot-password",
    options: UserRoute.forgotPassword,
  },
  {
    method: "POST",
    path: "/user/change-password",
    options: UserRoute.changePassword,
  },

  {
    method: "POST",
    path: "/user/staff-get-list-user",
    options: UserRoute.find,
  },
  {
    method: "POST",
    path: "/user/user-token-getlist",
    options: UserRoute.findUserToken,
  },
  {
    method: "POST",
    path: "/user/staff-update-user",
    options: UserRoute.updateById,
  },
  {
    method: "POST",
    path: "/user/update-usertoken-detail",
    options: UserRoute.updateTokendetail,
  },
  {
    method: "POST",
    path: "/user/update-usertokendetail/usage-count",
    options: UserRoute.updateTokenDetailUsageCount,
  },
  {
    method: "POST",
    path: "/user/staff-insert-user",
    options: UserRoute.insert,
  },
  {
    method: "GET",
    path: "/user/staff-get-detail",
    options: UserRoute.findById,
  },
  {
    method: "GET",
    path: "/user/token-get-detail",
    options: UserRoute.tokenDetailById,
  },
  {
    method: "DELETE",
    path: "/user/delete-usertoken-detail",
    options: UserRoute.removeTokenDetail,
  },

  {
    method: "POST",
    path: "/user/training/history",
    options: UserRoute.insertTrainingHistory,
  },
  {
    method: "POST",
    path: "/user/training/history/get-list",
    options: UserRoute.findTrainingHistory,
  },
  {
    method: "GET",
    path: "/user/training-history-detail",
    options: UserRoute.getTrainingHistoryDetail,
  },
];
