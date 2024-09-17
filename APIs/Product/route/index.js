const ProductRoute = require("./ProductRoute");
const UserProductRoute = require("./UserProductRoute");

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

  { method: "POST", path: "/product/buy", options: ProductRoute.buy },
  {
    method: "POST",
    path: "/product/buy-service",
    options: ProductRoute.buyService,
  },
  {
    method: "GET",
    path: "/product/my-service",
    options: ProductRoute.myService,
  },
  {
    method: "POST",
    path: "/product/fe-transactions",
    options: ProductRoute.getTransactions,
  },
  {
    method: "POST",
    path: "/product/transaction/detail",
    options: ProductRoute.getTransactionDetail,
  },
  {
    method: "POST",
    path: "/product/transactionCloud/detail",
    options: ProductRoute.getTransactionCloudDetail,
  },
  {
    method: "POST",
    path: "/product/transactions",
    options: ProductRoute.geAlltTransactions,
  },
  {
    method: "PUT",
    path: "/product/transactions",
    options: ProductRoute.updateTransaction,
  },
  { method: "POST", path: "/product/extend", options: ProductRoute.extend },
  {
    method: "GET",
    path: "/product/find-detail-transaction",
    options: ProductRoute.findDetailTransaction,
  },
  {
    method: "POST",
    path: "/product/check-buy",
    options: ProductRoute.checkBuy,
  },
  {
    method: "POST",
    path: "/user-product/updateById",
    options: UserProductRoute.updateById,
  },
  {
    method: "POST",
    path: "/user-product/deleteById",
    options: UserProductRoute.deleteById,
  },
  {
    method: "POST",
    path: "/user-product/find",
    options: UserProductRoute.find,
  },
  {
    method: "POST",
    path: "/user-product/user-find",
    options: UserProductRoute.userFind,
  },
  {
    method: "POST",
    path: "/user-product/findAll",
    options: UserProductRoute.findAll,
  },
  {
    method: "POST",
    path: "/user-product/findById",
    options: UserProductRoute.findById,
  },
  {
    method: "POST",
    path: "/product/transactions-token",
    options: ProductRoute.getAllTransactionsToken,
  },
];
