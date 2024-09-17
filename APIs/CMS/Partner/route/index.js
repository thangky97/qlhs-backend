const PartnerRoute = require("./PartnerRoute");

module.exports = [
  { method: "GET", path: "/partner/list", options: PartnerRoute.getAll },
  { method: "POST", path: "/partner/find", options: PartnerRoute.find },
  { method: "POST", path: "/partner/add", options: PartnerRoute.insert },
  {
    method: "DELETE",
    path: "/partner/delete",
    options: PartnerRoute.deleteById,
  },
  {
    method: "POST",
    path: "/partner/update",
    options: PartnerRoute.updateById,
  },
  {
    method: "GET",
    path: "/partner/get-detail",
    options: PartnerRoute.getDetail,
  },
];
