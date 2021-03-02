import testHelper from 'node-red-node-test-helper';
import { BaseNodeTestHelper } from './helpers/BaseNodeTestHelper';

const type = 'discord-send-messages';

const nodeTestHelper = BaseNodeTestHelper.getInstance(type);

describe(`${type} Node`, () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => testHelper.stopServer(done));
  });

  it('Should be loaded', nodeTestHelper.shouldLoad);

  it('Should throw empty token error', nodeTestHelper.shouldRejectEmptyToken);

  it('Should throw wrong token error', nodeTestHelper.shouldRejectWrongToken);

  it('Should login with provided token', nodeTestHelper.shouldLogin);
});
