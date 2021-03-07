import testHelper, { TestFlowsItem } from 'node-red-node-test-helper';
import { BaseNodeTestHelper } from './helpers/BaseNodeTestHelper';
import tokenNode from '../nodes/discord-token/discord-token';
import senderNode from '../nodes/discord-send-messages/discord-send-messages';
import { SinonSpyCall } from 'sinon';
import { NodeStatusMessage } from '../nodes/shared/constants';
import { DiscordTokenNodeDef } from '../nodes/discord-token/modules/types';
import { DiscordGetMessagesNodeDef } from '../nodes/discord-get-messages/modules/types';
import { NodeFlowMessage } from '../nodes/discord-send-messages/modules/types';

const type = 'discord-send-messages';

const nodeTestHelper = BaseNodeTestHelper.getInstance(type);

type TokenFlowsItem = TestFlowsItem<DiscordTokenNodeDef>;
type ReceiverFlowsItem = TestFlowsItem<DiscordGetMessagesNodeDef>;
type Flows = Array<TokenFlowsItem | ReceiverFlowsItem>;

const nodes = [tokenNode, senderNode];

const baseTokenNode = {
  id: 'sender-token',
  type: 'discord-token',
  name: 'Sender Bot',
  token: process.env.NRD_SENDER_BOT_TOKEN,
};

const baseSenderNode = {
  id: 'sender',
  type: 'discord-send-messages',
  name: 'send-messages',
  token: 'sender-token',
};

describe(`${type} Node`, () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => testHelper.stopServer(done));
  });

  it('Should be loaded', nodeTestHelper.shouldLoad);

  it('Should throw empty token error', nodeTestHelper.shouldRejectEmptyToken);

  it('Should throw wrong token error', (done): void => {
    const flows: Flows = [
      { ...baseTokenNode, token: 'Wrong token' },
      { ...baseSenderNode, token: baseTokenNode.id },
    ];

    testHelper.load(nodes, flows, () => {
      const node = testHelper.getNode(baseSenderNode.id);

      node.receive({ msg: 'Test msg' } as NodeFlowMessage);

      node.addListener('call:status', (call: SinonSpyCall) => {
        if (call.firstArg.text !== NodeStatusMessage.CLIENT_CONNECTING) {
          expect(call.firstArg.text).toBe(NodeStatusMessage.CLIENT_WRONG_TOKEN);
          done();
        }
      });
    });
  });

  it('Should login with provided token', (done) => {
    const flows: Flows = [
      baseTokenNode,
      { ...baseSenderNode, token: baseTokenNode.id },
    ];

    testHelper.load(nodes, flows, () => {
      const node = testHelper.getNode(baseSenderNode.id);

      node.receive({
        msg: 'Test msg',
        channel: '45487845487',
      } as NodeFlowMessage);

      node.addListener('call:status', (call: SinonSpyCall) => {
        if (call.firstArg.text !== NodeStatusMessage.CLIENT_CONNECTING) {
          expect(call.firstArg.text).toBe(NodeStatusMessage.CLIENT_READY);
          done();
        }
      });
    });
  });
});
