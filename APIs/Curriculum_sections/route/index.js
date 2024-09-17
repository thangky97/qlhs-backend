const Curriculum_sectionsRoute = require("./Curriculum_sectionsRoute");

module.exports = [
  {
    method: "POST",
    path: "/sections/update",
    options: Curriculum_sectionsRoute.updateById,
  },

  {
    method: "POST",
    path: "/sections/get-list",
    options: Curriculum_sectionsRoute.find,
  },
  {
    method: "POST",
    path: "/sections/insert",
    options: Curriculum_sectionsRoute.insert,
  },
  {
    method: "POST",
    path: "/sections/user-get-list",
    options: Curriculum_sectionsRoute.getList,
  },
  {
    method: "GET",
    path: "/sections/get-detail",
    options: Curriculum_sectionsRoute.findById,
  },
  {
    method: "DELETE",
    path: "/sections/deleteId",
    options: Curriculum_sectionsRoute.deleteById,
  },
  {
    method: "GET",
    path: "/sections/user-get-detail",
    options: Curriculum_sectionsRoute.getDetail,
  },
];
