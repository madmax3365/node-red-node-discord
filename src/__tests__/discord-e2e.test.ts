import testHelper, { TestFlowsItem } from 'node-red-node-test-helper';
import tokenNode from '../nodes/discord-token/discord-token';
import sendNode from '../nodes/discord-send-messages/discord-send-messages';
import getNode from '../nodes/discord-get-messages/discord-get-messages';
import { DiscordTokenNodeDef } from '../nodes/discord-token/modules/types';
import { DiscordGetMessagesNodeDef } from '../nodes/discord-get-messages/modules/types';
import {
  DiscordSendMessagesNodeDef,
  NodeFlowMessage,
} from '../nodes/discord-send-messages/modules/types';
import { SinonSpyCall } from 'sinon';
import { RedMessage } from '../nodes/shared/types';
import { NodeStatusMessage } from '../nodes/shared/constants';

type TokenFlowsItem = TestFlowsItem<DiscordTokenNodeDef>;
type TestedFlowsItem = TestFlowsItem<
  DiscordGetMessagesNodeDef | DiscordSendMessagesNodeDef
>;
type Flows = Array<TokenFlowsItem | TestedFlowsItem>;

describe('End-to-End functionality tests', () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => testHelper.stopServer(done));
  });

  it('Should send and receive messages', (done) => {
    const flows: Flows = [
      {
        id: 'sender-token',
        type: 'discord-token',
        name: 'Sender Bot',
        token: process.env.NRD_SENDER_BOT_TOKEN,
      },
      {
        id: 'sender',
        type: 'discord-send-messages',
        name: 'send-messages',
        token: 'sender-token',
      },
      {
        id: 'receiver-token',
        type: 'discord-token',
        name: 'Receiver Bot',
        token: process.env.NRD_RECEIVER_BOT_TOKEN,
      },
      {
        id: 'receiver',
        type: 'discord-get-messages',
        name: 'get-messages',
        token: 'receiver-token',
        wires: [['output-node']],
      },
      {
        id: 'output-node',
        type: 'helper',
      },
    ];

    testHelper.load([tokenNode, sendNode, getNode], flows, () => {
      const sender = testHelper.getNode('sender');

      const helper = testHelper.getNode('output-node');

      sender.receive({
        channel: '637030062155235334',
        msg: `Ping @!(${process.env.NRD_MENTIONABLE_USER}), and @&(${process.env.NRD_MENTIONABLE_ROLE})`,
      } as NodeFlowMessage);

      helper.on('input', (msg) => {
        expect((msg as RedMessage).metadata.content.toLowerCase()).toBe(
          `Ping ${process.env.NRD_MENTIONABLE_USER}, and ${process.env.NRD_MENTIONABLE_ROLE}`.toLowerCase(),
        );
        done();
      });

      sender.addListener('call:status', (call: SinonSpyCall) => {
        if (
          ![
            NodeStatusMessage.CLIENT_CONNECTING,
            NodeStatusMessage.CLIENT_READY,
          ].includes(call.firstArg.text)
        ) {
          console.log('e2e -- conditions met', call.firstArg);
          expect(call.firstArg.text).toBe(
            NodeStatusMessage.CLIENT_MESSAGE_SUCCESS,
          );
        }
      });
    });
  });
});
