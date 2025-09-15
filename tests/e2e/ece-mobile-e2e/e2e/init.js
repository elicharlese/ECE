const detox = require('detox');
const config = require('../.detoxrc.json');

beforeAll(async () => {
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});
