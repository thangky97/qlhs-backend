const Department = require("./DepartmentRoute");

module.exports = [
  {
    method: "POST",
    path: "/department/update",
    options: Department.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/department/delete",
  //   options: Department.deleteById,
  // },
  { method: "POST", path: "/department/get-list", options: Department.find },
  { method: "POST", path: "/department/insert", options: Department.insert },
  {
    method: "GET",
    path: "/department/get-detail",
    options: Department.findById,
  },
];
