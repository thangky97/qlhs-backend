const Course = require("./CourseRoute");

module.exports = [
  {
    method: "POST",
    path: "/course/update",
    options: Course.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/course/delete",
  //   options: Course.deleteById,
  // },
  { method: "POST", path: "/course/get-list", options: Course.find },
  { method: "POST", path: "/course/insert", options: Course.insert },
  {
    method: "GET",
    path: "/course/get-detail",
    options: Course.findById,
  },
];
