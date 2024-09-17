const NotificationRoute = require("./NotificationRoute");

module.exports = [
  {
    method: "POST",
    path: "/notification/update",
    options: NotificationRoute.updateById,
  },
  {
    method: "DELETE",
    path: "/notification/delete",
    options: NotificationRoute.deleteById,
  },
  {
    method: "POST",
    path: "/notification/get-list",
    options: NotificationRoute.find,
  },
  {
    method: "POST",
    path: "/notification/insert",
    options: NotificationRoute.insert,
  },
  {
    method: "POST",
    path: "/notification/user-get-list",
    options: NotificationRoute.getList,
  },
  {
    method: "GET",
    path: "/notification/get-detail",
    options: NotificationRoute.findById,
  },
  {
    method: "GET",
    path: "/notification/user-get-detail",
    options: NotificationRoute.getDetail,
  },
];
