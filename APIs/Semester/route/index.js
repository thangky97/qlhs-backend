const Semester = require("./SemesterRoute");

module.exports = [
  {
    method: "POST",
    path: "/semester/update",
    options: Semester.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/semester/delete",
  //   options: Semester.deleteById,
  // },
  { method: "POST", path: "/semester/get-list", options: Semester.find },
  { method: "POST", path: "/semester/insert", options: Semester.insert },
  {
    method: "GET",
    path: "/semester/get-detail",
    options: Semester.findById,
  },
];
