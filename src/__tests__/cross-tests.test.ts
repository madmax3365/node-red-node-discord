/**
 * Test nodes combined with other nodes here
 *
 * E.g. send node with receive node etc.
 */

import testHelper, { TestFlowsItem } from 'node-red-node-test-helper';
import { DiscordTokenNodeDef } from '../nodes/discord-token/modules/types';
import { DiscordGetMessagesNodeDef } from '../nodes/discord-get-messages/modules/types';
import { DiscordSendMessagesNodeDef } from '../nodes/discord-send-messages/modules/types';
import tokenNode from '../nodes/discord-token/discord-token';
import getNode from '../nodes/discord-get-messages/discord-get-messages';
import sendNode from '../nodes/discord-send-messages/discord-send-messages';
import { NodeType } from '../nodes/shared/types';

type TokenFlowsItem = TestFlowsItem<DiscordTokenNodeDef>;
type TestedFlowsItem = TestFlowsItem<
  DiscordGetMessagesNodeDef | DiscordSendMessagesNodeDef
>;
type Flows = Array<TokenFlowsItem | TestedFlowsItem>;
type BaseFlow = [TestedFlowsItem, TokenFlowsItem];

// Reusable constants

const generateFlow = (type: NodeType): BaseFlow => {
  const tokenItem: TokenFlowsItem = {
    id: `${type.replace('discord-', '')}-token`,
    type: 'discord-token',
    name: `${type} token`,
    token:
      process.env[
        type === 'discord-send-messages'
          ? 'NRD_SENDER_BOT_TOKEN'
          : 'NRD_RECEIVER_BOT_TOKEN'
      ],
  };

  const nodeItem = {
    id: type.replace('discord-', ''),
    type,
    name: `${type} node`,
    token: tokenItem.id,
  };

  return [nodeItem, tokenItem];
};

// Test suits
describe('Core functionality', () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => testHelper.stopServer(done));
  });

  it('Should send and receive messages', () => {});
});
