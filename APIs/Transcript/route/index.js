const TranscriptRoute = require("./TranscriptRoute");

module.exports = [
  {
    method: "POST",
    path: "/transcript/update",
    options: TranscriptRoute.updateById,
  },

  {
    method: "POST",
    path: "/transcript/get-list",
    options: TranscriptRoute.find,
  },
  {
    method: "POST",
    path: "/transcript/insert",
    options: TranscriptRoute.insert,
  },
  {
    method: "POST",
    path: "/transcript/user-get-list",
    options: TranscriptRoute.getList,
  },
  {
    method: "GET",
    path: "/transcript/get-detail",
    options: TranscriptRoute.findById,
  },
  {
    method: "GET",
    path: "/transcript/user-get-detail",
    options: TranscriptRoute.getDetail,
  },
];
