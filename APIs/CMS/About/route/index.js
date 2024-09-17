const AboutRoute = require("./AboutRoute");

module.exports = [
  {
    method: "GET",
    path: "/about/list",
    options: AboutRoute.getAll,
  },
  {
    method: "GET",
    path: "/about/detail",
    options: AboutRoute.getDetail,
  },
  {
    method: "POST",
    path: "/about/update",
    options: AboutRoute.updateById,
  },
  {
    method: "POST",
    path: "/about/add",
    options: AboutRoute.insert,
  },
  {
    method: "DELETE",
    path: "/about/delete",
    options: AboutRoute.deleteById,
  },
  {
    method: "POST",
    path: "/about/contact",
    options: AboutRoute.contact,
  },
  {
    method: "POST",
    path: "/send/notificate",
    options: AboutRoute.notification,
  },
  {
    method: "POST",
    path: "/about/cloudContact",
    options: AboutRoute.cloudContact,
  },
  {
    method: "POST",
    path: "/send/paycloud",
    options: AboutRoute.sendpaycloud,
  },
  {
    method: "POST",
    path: "/about/send-token-order-information",
    options: AboutRoute.sendTokenOrderInformation,
  },
];
