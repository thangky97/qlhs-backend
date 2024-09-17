const User_quizsRoute = require("./User_quizsRoute");

module.exports = [
  {
    method: "POST",
    path: "/user/quiz/update",
    options: User_quizsRoute.updateById,
  },

  {
    method: "POST",
    path: "/user/quiz/get-list",
    options: User_quizsRoute.find,
  },
  {
    method: "POST",
    path: "/user/quiz/insert",
    options: User_quizsRoute.insert,
  },
  {
    method: "POST",
    path: "/user/quiz/user-get-list",
    options: User_quizsRoute.getList,
  },
  {
    method: "GET",
    path: "/user/quiz/get-detail",
    options: User_quizsRoute.findById,
  },
  {
    method: "GET",
    path: "/user/quiz/user-get-detail",
    options: User_quizsRoute.getDetail,
  },
];
