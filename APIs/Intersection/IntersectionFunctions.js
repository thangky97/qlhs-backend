"use strict";
const DB = require("../../models");

// async function checkAvailableIntersection(serviceId, User_ID) {
//   let data = await DB.user_product.findOne({
//     where: {
//       id: serviceId,
//     },
//     raw: true,
//   });

//   if (!data) {
//     throw "failed";
//   }

//   let intersectionUsed = await DB.m_intersection.count({
//     where: {
//       User_ID: User_ID,
//       is_deleted: 0,
//       Service_Mapping_ID: serviceId,
//     },
//   });

//   if (
//     data.total_intersection &&
//     data.total_intersection - intersectionUsed > 0
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }

// module.exports = {
//   checkAvailableIntersection,
// };
