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

  for (let i = 1; i <= 10; i++) {
    it('insert test data q traffic status', done => {
      let body = {
        "Camera_ID": i,
        "Vehicle_L": Math.round(Math.random() * 34),
        "Edge_ID": Math.round(Math.random() * 10),
        "Vehicle_M": Math.round(Math.random() * 46),
        "Vehicle_S": Math.round(Math.random() * 32),
        "DateTime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "Note": "string",
        "Intersection_ID": i
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/q-traffic-status/insert`)
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