const Demo_Cloud_Applications = require("./Demo_Cloud_ApplicationRoute");

module.exports = [
  {
    method: "POST",
    path: "/democloudapplication/update",
    options: Demo_Cloud_Applications.updateById,
  },
  {
    method: "POST",
    path: "/democloudapplication/delete",
    options: Demo_Cloud_Applications.deleteById,
  },
  {
    method: "POST",
    path: "/democloudapplication/get-list",
    options: Demo_Cloud_Applications.find,
  },
  {
    method: "POST",
    path: "/democloudapplication/insert",
    options: Demo_Cloud_Applications.insert,
  },
  {
    method: "POST",
    path: "/democloudapplication/user-get-list",
    options: Demo_Cloud_Applications.getList,
  },
  {
    method: "GET",
    path: "/democloudapplication/get-detail",
    options: Demo_Cloud_Applications.findById,
  },
  {
    method: "GET",
    path: "/democloudapplication/user-get-detail",
    options: Demo_Cloud_Applications.getDetail,
  },
];
