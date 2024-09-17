const UsersectionprogressRoute = require("./UsersectionprogressRoute");

module.exports = [
  {
    method: "POST",
    path: "/user/sectionprogress/update",
    options: UsersectionprogressRoute.updateById,
  },

  {
    method: "POST",
    path: "/user/sectionprogress/get-list",
    options: UsersectionprogressRoute.find,
  },
  {
    method: "POST",
    path: "/user/sectionprogress/insert",
    options: UsersectionprogressRoute.insert,
  },
  {
    method: "POST",
    path: "/user/sectionprogress/user-get-list",
    options: UsersectionprogressRoute.getList,
  },
  {
    method: "GET",
    path: "/user/sectionprogress/get-detail",
    options: UsersectionprogressRoute.findById,
  },
  {
    method: "GET",
    path: "/user/sectionprogress/user-get-detail",
    options: UsersectionprogressRoute.getDetail,
  },
];
