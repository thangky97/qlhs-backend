const Instructors = require("./InstructorsRoute");

module.exports = [
  {
    method: "POST",
    path: "/instructors/update",
    options: Instructors.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/instructors/delete",
  //   options: Instructors.deleteById,
  // },
  { method: "POST", path: "/instructors/get-list", options: Instructors.find },
  { method: "POST", path: "/instructors/insert", options: Instructors.insert },
  {
    method: "POST",
    path: "/instructors/user-get-list",
    options: Instructors.getList,
  },
  {
    method: "GET",
    path: "/instructors/get-detail",
    options: Instructors.findById,
  },
  {
    method: "GET",
    path: "/instructors/user-get-detail",
    options: Instructors.getDetail,
  },
];
