const HistoryRoute = require("./HistoryRoute");

module.exports = [
  {
    method: "POST",
    path: "/history/update",
    options: HistoryRoute.updateById,
  },

  {
    method: "POST",
    path: "/history/get-list",
    options: HistoryRoute.find,
  },
  {
    method: "POST",
    path: "/history/insert",
    options: HistoryRoute.insert,
  },
  {
    method: "POST",
    path: "/history/user-get-list",
    options: HistoryRoute.getList,
  },
  {
    method: "GET",
    path: "/history/get-detail",
    options: HistoryRoute.findById,
  },
  {
    method: "DELETE",
    path: "/history/deleteId",
    options: HistoryRoute.deleteById,
  },
  {
    method: "GET",
    path: "/history/user-get-detail",
    options: HistoryRoute.getDetail,
  },
];
