const Course_files = require("./Course_filesRoute");

module.exports = [
  {
    method: "POST",
    path: "/course_files/update",
    options: Course_files.updateById,
  },
  {
    method: "POST",
    path: "/course_files/delete",
    options: Course_files.deleteById,
  },
  {
    method: "POST",
    path: "/course_files/get-list",
    options: Course_files.find,
  },
  {
    method: "POST",
    path: "/course_files/insert",
    options: Course_files.insert,
  },
  {
    method: "POST",
    path: "/course_files/user-get-list",
    options: Course_files.getList,
  },
  {
    method: "GET",
    path: "/course_files/get-detail",
    options: Course_files.findById,
  },
  {
    method: "GET",
    path: "/course_files/user-get-detail",
    options: Course_files.getDetail,
  },
];
