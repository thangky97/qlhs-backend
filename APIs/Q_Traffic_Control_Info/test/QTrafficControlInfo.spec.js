const chai = require('chai');
const chaiHttp = require('chai-http');
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

  for (let i = 1; i <= 10; i++) {
    it('insert test data q traffic control info', done => {
      let body = {
        Intersection_ID: i,
        Process_ID: Math.round(Math.random() * 1000),
        Process_Status: i % 2 === 0 ? 0 : 1,
        On_Off_line: i % 2 === 0 ? 0 : 1,
        Q_Traffic_Machine_ID: Math.round(Math.random() * 100),
        Q_Machine_ID: Math.round(Math.random() * 100),
        User_ID: 1
      };

      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/q-traffic-control-info/insert`)
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

});