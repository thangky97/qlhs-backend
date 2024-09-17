const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
require('dotenv').config();

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

describe(`Test Q traffic control`, () => {
  before((done) => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      resolve();
    }).then(() => done());
  });

  for (let j = 0; j < 8; j++) {
    for (let i = 1; i <= 10; i++) {
      it('insert test data q traffic status', done => {
        let body = {
          "Media_URL": `https://via.placeholder.com/${Math.round(Math.random() * 302)}/${Math.round(Math.random() * 202)}`,
          "Media_Type": "IMAGE",
          "DateTime": moment().format('YYYY-MM-DD HH:mm:ss'),
          "Intersection_ID": i
        };
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/q-traffic-media/insert`)
          .send(body)
          .set("Authorization", staffToken)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            checkResponseStatus(res, 200);
            done();
          });
      });
    }
  }

});