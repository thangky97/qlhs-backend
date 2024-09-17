const DB = require("../../models");
const UserFunction = require("../User/UserFunctions");

async function syncDataQTraffic(transactionData) {
  let transaction = await DB.transaction.findOne({
    where: { id: transactionData.id },
    raw: true,
  });
  if (!transaction) {
    return;
  }

  let user_product = await DB.transaction.findOne({
    where: { id: transaction.id },
  });
  if (!user_product) {
    return;
  }

  let syncUserID = await UserFunction.syncData(user_product.user_id);

  // nếu là mua => tạo token
  let endDate = user_product.expiredAt;
  if (transaction.type === "new_order") {
    await updateOrCreateToken("create", {
      Token: user_product.token,
      Token_Expired: endDate,
      User_ID: syncUserID,
      Note: "SYSTEM_AUTO_GENERATED",
    });
  }
  // nếu là gia hạn => update to date
  else {
    await updateOrCreateToken(
      "update",
      {
        Token_Expired: endDate,
      },
      {
        where: {
          User_ID: syncUserID,
          Token: user_product.token,
        },
      }
    );
  }

  await DB.t_q_traffic.create({
    Amount: transaction.payment_money,
    Service: user_product.service,
    Transaction_Type: transaction.type,
    Time: transaction.time,
    User_ID: syncUserID,
    Note: transaction.note,
    DateTime: transaction.createdAt,
  });
}

async function updateOrCreateToken(functionName, ...data) {
  let resConfigToken = await DB.m_token[functionName](...data);
  console.log("resAddToken", resConfigToken);
}

module.exports = {
  syncDataQTraffic,
};
