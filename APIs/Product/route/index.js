const ProductRoute = require("./ProductRoute");

module.exports = [
  { method: "POST", path: "/product/insert", options: ProductRoute.insert },
  { method: "POST", path: "/product/update", options: ProductRoute.update },
  { method: "POST", path: "/product/find", options: ProductRoute.find },
  {
    method: "POST",
    path: "/product/user-get-list",
    options: ProductRoute.getList,
  },
  {
    method: "GET",
    path: "/product/get-detail",
    options: ProductRoute.getDetail,
  },
  {
    method: "GET",
    path: "/product/get-detail-user",
    options: ProductRoute.getDetailuser,
  },
  {
    method: "GET",
    path: "/product/get-scores",
    options: ProductRoute.getScore,
  },
  {
    method: "GET",
    path: "/product/user-get-product-detail",
    options: ProductRoute.userGetProductDetail,
  },
  {
    method: "GET",
    path: "/product/get-detail-course",
    options: ProductRoute.getDetailcourse,
  },
  {
    method: "GET",
    path: "/product/get-detail-user-course",
    options: ProductRoute.getDetailusercourse,
  },
  { method: "POST", path: "/product/delete", options: ProductRoute.deleteById },
];
