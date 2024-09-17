const SettingRoute = require("./SettingRoute");

module.exports = [
  {
    method: "GET",
    path: "/setting/detail",
    options: SettingRoute.getAll,
  },
  {
    method: "POST",
    path: "/setting/update",
    options: SettingRoute.updateById,
  },
  {
    method: "POST",
    path: "/setting/add",
    options: SettingRoute.insert,
  },
  // {
  //   method: "DELETE",
  //   path: "/setting/delete",
  //   options: SettingRoute.deleteById,
  // },
];
