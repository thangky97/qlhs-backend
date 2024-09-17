const Course_progress = require("./Course_progressRoute");

module.exports = [
  {
    method: "POST",
    path: "/course_progress/update",
    options: Course_progress.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/course_files/delete",
  //   options: Course_files.deleteById,
  // },
  {
    method: "POST",
    path: "/course_progress/get-list",
    options: Course_progress.find,
  },
  {
    method: "POST",
    path: "/course_progress/insert",
    options: Course_progress.insert,
  },
  // {
  //   method: "POST",
  //   path: "/course_files/user-get-list",
  //   options: Course_files.getList,
  // },
  {
    method: "GET",
    path: "/course_progress/get-detail",
    options: Course_progress.findById,
  },
  // {
  //   method: "GET",
  //   path: "/course_files/user-get-detail",
  //   options: Course_files.getDetail,
  // },
];
