const DB = require('../../../models/index');

async function UpdateProductTime() {
  const query = {
    where: {
      status: 1,
      expiredAt: {
        [DB.Sequelize.Op.lt]: new Date().toISOString()
      }
    }
  };
  let quantity = await DB.user_product.count(query);
  let numBatch = 1;
  console.log('quantity - ', quantity);
  // nếu nhiều quá chia ra batch 100 collection / 1 lần
  if (quantity > 100) {
    numBatch = Math.ceil(quantity / 100);
  }
  for (let i = 0; i < numBatch; i++) {
    let offset = i * 100;
    let limit = 100;
    query.offset = offset;
    query.limit = limit;
    let products = await DB.user_product.findAll(query);
    for (let j = 0; j < products.length; j++) {
      let product = products[j];
      await product.update({ status: 0 });
      await product.save();
    }
  }
}

module.exports = UpdateProductTime