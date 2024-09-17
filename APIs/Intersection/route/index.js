const IntersectionRoutes = require("./IntersectionRoutes");

module.exports = [
  {
    method: "POST",
    path: "/intersection/insert",
    config: IntersectionRoutes.insert,
  },
  {
    method: "POST",
    path: "/intersection/update",
    config: IntersectionRoutes.updateById,
  },
];
