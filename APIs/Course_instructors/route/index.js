const Course_instructors = require("./Course_instructorsRoute");

module.exports = [
  {
    method: "POST",
    path: "/course_instructors/update",
    options: Course_instructors.updateById,
  },
  {
    method: "POST",
    path: "/course_instructors/delete",
    options: Course_instructors.deleteById,
  },
  {
    method: "POST",
    path: "/course_instructors/get-list",
    options: Course_instructors.find,
  },
  {
    method: "POST",
    path: "/course_instructors/insert",
    options: Course_instructors.insert,
  },
  {
    method: "POST",
    path: "/course_instructors/user-get-list",
    options: Course_instructors.getList,
  },
  {
    method: "GET",
    path: "/course_instructors/get-detail",
    options: Course_instructors.findById,
  },
  {
    method: "GET",
    path: "/course_instructors/user-get-detail",
    options: Course_instructors.getDetail,
  },
];
