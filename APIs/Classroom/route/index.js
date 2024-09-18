const Classroom = require("./ClassroomRoute");

module.exports = [
  {
    method: "POST",
    path: "/classroom/update",
    options: Classroom.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/classroom/delete",
  //   options: Classroom.deleteById,
  // },
  { method: "POST", path: "/classroom/get-list", options: Classroom.find },
  { method: "POST", path: "/classroom/insert", options: Classroom.insert },
  {
    method: "GET",
    path: "/classroom/get-detail",
    options: Classroom.findById,
  },
];
