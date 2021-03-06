const request = require('supertest');
const { expect } = require('chai');

require('../../helpers/testSetup');

const app = require('../../../app.js');

describe('Root path', async () => {
  it('returns greeting', async () => {
    const res = await request(app)
      .get('/')
      .redirects()
      .expect(200);

    expect(res.err).to.be.undefined; // eslint-disable-line no-unused-expressions
    expect(res.text).to.include('BLDG 61 Calendar');
    expect(res.text).to.include('Laser Guided Access');
  }).timeout(5000);
});
