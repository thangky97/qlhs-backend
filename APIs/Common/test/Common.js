const chai = require('chai');
const expect = chai.expect;
const jsonComparer = require('deep-diff');
const { readFile } = require('fs');
const Logger = require('../../../utils/logging');

function checkResponseStatus(res, expected) {
  expect(res).to.not.equal(undefined);
  if (res.body && res.body.statusCode !== expected) {
    Logger.log('info', '========Request=======');
    Logger.log('info', res.request.url);
    Logger.log('info', res.request.method);
    Logger.log('info', res.request._header);
    Logger.log('info', JSON.stringify(res.request._data));
    Logger.log('info', '========Response======');
    Logger.log('info', res.body);
    Logger.log('info', '=============================================');
  }
  expect(res).to.have.status(expected);
  expect(res.body.statusCode === expected);
}

var lhs = {
  name: 'my object',
  description: "it's an object!",
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements'],
  },
};

/* sample */
// var rhs = {
//   body: {
//     name: 'updated object',
//     description: 'it\'s an object!',
//     details: {
//       it: 'has',
//       an: 'array',
//       with: ['a', 'few', 'more', 'elements', { than: 'before' }]
//     }
//   }
// };
// checkResponseBody(rhs, './test/sample.json');

async function checkResponseBody(res, templatePath) {
  if (res.body === undefined) {
    Logger.log('========Request=======');
    Logger.log(res.request.url);
    Logger.log(res.request.method);
    Logger.log(res.request._header);
    Logger.log(res.request._data);
    Logger.log('========Response======');
    Logger.log(res.body);
  }

  return new Promise((resolve, reject) => {
    readFile(templatePath, 'utf8', (err, data) => {
      if (err) {
        Logger.log(err);
        reject(err);
      }
      let templateData = JSON.parse(data);

      let matchResult = jsonComparer(templateData, res.body);
      const TOTALLY_MATCHED = undefined;

      if (matchResult !== TOTALLY_MATCHED) {
        for (let i = 0; i < matchResult.length; i++) {
          const result = matchResult[i];
          if (result.kind === 'N' || result.kind === 'D') {
            Logger.log(result);
          }
          if (result.kind === 'E') {
            if (result.lhs && result.lhs !== null && result.lhs.it && result.lhs.an) {
              Logger.log(result);
              expect(result.lhs.an).to.not.equal('array');
            } else if (result.rhs && result.rhs !== null && result.rhs.it && result.rhs.an) {
              Logger.log(result);
              expect(result.rhs.an).to.not.equal('array');
            }
          }
          expect(result.kind).to.not.equal('N');
          expect(result.kind).to.not.equal('D');
        }
      }
      resolve(matchResult);
    });
  });
}

module.exports = {
  checkResponseStatus,
  checkResponseBody,
};
