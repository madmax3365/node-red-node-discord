import { NodeProperties, Red } from 'node-red';

import { IConnectConfig } from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType(
    'discord-token',
    function(this: IConnectConfig, props: NodeProperties): void {
      RED.nodes.createNode(this, props);
      this.token = this.credentials.token;
      this.name = props.name;
    },
    {
      credentials: {
        token: { type: 'password' },
      },
    },
  );
};
