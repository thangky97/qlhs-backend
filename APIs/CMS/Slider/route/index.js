const SliderRoute = require("./SliderRoute");

module.exports = [
  { method: "GET", path: "/slider/list", options: SliderRoute.getAll },
  { method: "POST", path: "/slider/find", options: SliderRoute.find },
  { method: "POST", path: "/slider/add", options: SliderRoute.insert },
  {
    method: "DELETE",
    path: "/slider/delete",
    options: SliderRoute.deleteById,
  },
  {
    method: "POST",
    path: "/slider/update",
    options: SliderRoute.updateById,
  },
  {
    method: "GET",
    path: "/slider/get-detail",
    options: SliderRoute.getDetail,
  },
];

