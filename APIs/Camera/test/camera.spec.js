const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const { checkResponseStatus } = require('../../Common/test/Common');
const TestFunctions = require('../../Common/test/CommonTestFunctions');
require('dotenv').config();


chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

let staffToken = "";

describe(`Test camera`, () => {
  before((done) => {
    new Promise(async (resolve, reject) => {
      let staffData = await TestFunctions.loginStaff();
      staffToken = `Bearer ${staffData.token}`;
      resolve();
    }).then(() => done());
  });
  for (let j = 1; j <= 8; j++) {
    for (let index = 1; index <= 10; index++) {
      it('insert camera', done => {
        const body = {
          "Camera_Type": "string",
          "Camera_model": Math.round(Math.random() * 100),
          "Intersection_ID": index,
          "IP_Address": faker.internet.ip(),
          "Control_Type": Math.floor(Math.random() * (3 - 1 + 1) + 1),
          "SerialNumber": "string",
          "Status": 1,
          "User_ID": 1
        };
        chai
          .request(`0.0.0.0:${process.env.PORT}`)
          .post(`/camera/insert`)
          .send(body)
          .set('Authorization', staffToken)
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