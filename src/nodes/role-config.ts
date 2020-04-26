import { NodeProperties, Red } from 'node-red';

import { IRoleConfig } from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType(
    'discord-role',
    function(this: IRoleConfig, props: NodeProperties): void {
      RED.nodes.createNode(this, props);
      this.roleId = this.credentials.roleId;
      this.name = props.name;
    },
    {
      credentials: {
        roleId: { type: 'text' },
      },
    },
  );
};
