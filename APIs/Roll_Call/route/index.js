const Roll_CallRoute = require("./Roll_CallRoute");

module.exports = [
  {
    method: "POST",
    path: "/roll_call/update",
    options: Roll_CallRoute.updateById,
  },

  {
    method: "POST",
    path: "/roll_call/get-list",
    options: Roll_CallRoute.find,
  },
  {
    method: "POST",
    path: "/roll_call/insert",
    options: Roll_CallRoute.insert,
  },
  {
    method: "POST",
    path: "/roll_call/user-get-list",
    options: Roll_CallRoute.getList,
  },
  {
    method: "GET",
    path: "/roll_call/get-detail",
    options: Roll_CallRoute.findById,
  },
  {
    method: "DELETE",
    path: "/roll_call/deleteId",
    options: Roll_CallRoute.deleteById,
  },
  {
    method: "GET",
    path: "/roll_call/user-get-detail",
    options: Roll_CallRoute.getDetail,
  },

  { method: "POST", path: "/roll_call/import", options: Roll_CallRoute.import },
];
