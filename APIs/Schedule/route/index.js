const Schedule = require("./ScheduleRoute");

module.exports = [
  {
    method: "POST",
    path: "/schedule/update",
    options: Schedule.updateById,
  },
  {
    method: "POST",
    path: "/schedule/delete",
    options: Schedule.deleteById,
  },
  {
    method: "POST",
    path: "/schedule/get-list",
    options: Schedule.find,
  },
  {
    method: "POST",
    path: "/schedule/insert",
    options: Schedule.insert,
  },
  {
    method: "POST",
    path: "/schedule/user-get-list",
    options: Schedule.getList,
  },
  {
    method: "GET",
    path: "/schedule/get-detail",
    options: Schedule.findById,
  },
  {
    method: "GET",
    path: "/schedule/user-get-detail",
    options: Schedule.getDetail,
  },
];
