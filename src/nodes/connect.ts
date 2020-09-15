import { NodeDef, NodeInitializer } from 'node-red';

import { IConnectConfig } from '../lib/interfaces';

const nodeInit: NodeInitializer = (RED): void => {
  RED.nodes.registerType(
    'discord-token',
    function (this: IConnectConfig, props: NodeDef): void {
      RED.nodes.createNode(this, props);
      this.token = this.credentials.token;
      this.name = props.name;
    },
    {
      credentials: {
        token: { type: 'text' },
      },
    },
  );
};

export = nodeInit;
