const Timetable = require("./TimetableRoute");

module.exports = [
  {
    method: "POST",
    path: "/timetable/update",
    options: Timetable.updateById,
  },
  // {
  //   method: "POST",
  //   path: "/timetable/delete",
  //   options: Timetable.deleteById,
  // },
  { method: "POST", path: "/timetable/get-list", options: Timetable.find },
  { method: "POST", path: "/timetable/insert", options: Timetable.insert },
  {
    method: "GET",
    path: "/timetable/get-detail",
    options: Timetable.findById,
  },
];
