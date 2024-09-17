const { CronInstance } = require("../../../ThirdParty/Cron");

const dailySchedule = () => {
  // every day
  CronInstance.schedule('0 0 * * *', async function () {
    const UpdateProductTime = require('./checkTimeProduct');
    await UpdateProductTime();

  });
};

async function startSchedule() {
  console.log("start cronjob product");
  dailySchedule();
}

module.exports = {
  startSchedule,
};
