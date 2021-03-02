import { NodeInitializer } from 'node-red';
import testHelper, { TestFlowsItem } from 'node-red-node-test-helper';
import { DiscordTokenNodeDef } from '../../nodes/discord-token/modules/types';
import { DiscordGetMessagesNodeDef } from '../../nodes/discord-get-messages/modules/types';
import DoneCallback = jest.DoneCallback;
import { DiscordSendMessagesNodeDef } from '../../nodes/discord-send-messages/modules/types';
import { SinonSpyCall } from 'sinon';
import { NodeStatusMessage } from '../../nodes/shared/constants';
import discordToken from '../../nodes/discord-token/discord-token';
import discordGetMessagesNode from '../../nodes/discord-get-messages/discord-get-messages';
import discordSendMessagesNode from '../../nodes/discord-send-messages/discord-send-messages';
import { NodeType } from '../../nodes/shared/types';

type TokenFlowsItem = TestFlowsItem<DiscordTokenNodeDef>;
type TestedFlowsItem = TestFlowsItem<
  DiscordGetMessagesNodeDef | DiscordSendMessagesNodeDef
>;
type Flows = Array<TokenFlowsItem | TestedFlowsItem>;
export class BaseNodeTestHelper {
  constructor(
    private nodes: NodeInitializer[],
    private baseTokenFlowItem: TokenFlowsItem,
    private baseTestedFlowItem: TestedFlowsItem,
    private token?: string,
  ) {}

  public shouldLoad = (done: DoneCallback): void => {
    const flows: Flows = [
      { ...this.baseTokenFlowItem, token: 'testing' },
      { ...this.baseTestedFlowItem, token: this.baseTokenFlowItem.id },
    ];
    testHelper.load(this.nodes, flows, () => {
      expect(testHelper.getNode(this.baseTestedFlowItem.id)).toBeTruthy();
      done();
    });
  };

  public shouldRejectEmptyToken = (done: DoneCallback): void => {
    const flows: Flows = [
      this.baseTokenFlowItem,
      { ...this.baseTestedFlowItem, token: this.baseTokenFlowItem.id },
    ];

    testHelper.load(this.nodes, flows, () => {
      testHelper
        .getNode(this.baseTestedFlowItem.id)
        .addListener('call:status', (call: SinonSpyCall) => {
          expect(call.firstArg.text).toBe(NodeStatusMessage.CLIENT_NO_TOKEN);
          done();
        });
    });
  };

  public shouldRejectWrongToken = (done: DoneCallback): void => {
    const flows: Flows = [
      { ...this.baseTokenFlowItem, token: 'Wrong token' },
      { ...this.baseTestedFlowItem, token: this.baseTokenFlowItem.id },
    ];

    testHelper.load(this.nodes, flows, () => {
      testHelper
        .getNode(this.baseTestedFlowItem.id)
        .addListener('call:status', (call: SinonSpyCall) => {
          expect(call.firstArg.text).toBe(NodeStatusMessage.CLIENT_WRONG_TOKEN);
          done();
        });
    });
  };

  public shouldLogin = (done: DoneCallback): void => {
    const flows: Flows = [
      { ...this.baseTokenFlowItem, token: this.token },
      { ...this.baseTestedFlowItem, token: this.baseTokenFlowItem.id },
    ];

    testHelper.load(this.nodes, flows, () => {
      testHelper
        .getNode(this.baseTestedFlowItem.id)
        .addListener('call:status', (call: SinonSpyCall) => {
          expect(call.firstArg.text).toBe(NodeStatusMessage.CLIENT_READY);
          done();
        });
    });
  };

  public static getInstance(type: NodeType): BaseNodeTestHelper {
    return new BaseNodeTestHelper(
      [
        discordToken,
        type === 'discord-get-messages'
          ? discordGetMessagesNode
          : discordSendMessagesNode,
      ],
      {
        id: 'token',
        type: 'discord-token',
        name: 'TestBot',
      },
      {
        id: type.replace('discord-', ''),
        type,
        name: type,
      },
      process.env[
        type === 'discord-get-messages'
          ? 'NRD_RECEIVER_BOT_TOKEN'
          : 'NRD_SENDER_BOT_TOKEN'
      ],
    );
  }
}
