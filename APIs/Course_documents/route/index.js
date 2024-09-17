const Course_documentsRoute = require("./Course_documentsRoute");

module.exports = [
  {
    method: "POST",
    path: "/course/documents/update",
    options: Course_documentsRoute.updateById,
  },
  {
    method: "DELETE",
    path: "/course/documents/delete",
    options: Course_documentsRoute.deleteId,
  },
  {
    method: "POST",
    path: "/course/documents/get-list",
    options: Course_documentsRoute.find,
  },
  {
    method: "POST",
    path: "/course/documents/insert",
    options: Course_documentsRoute.insert,
  },
  {
    method: "POST",
    path: "/course/documents/user-get-list",
    options: Course_documentsRoute.getList,
  },
  {
    method: "GET",
    path: "/course/documents/get-detail",
    options: Course_documentsRoute.findById,
  },
  {
    method: "GET",
    path: "/course/documents/user-get-detail",
    options: Course_documentsRoute.getDetail,
  },
];
