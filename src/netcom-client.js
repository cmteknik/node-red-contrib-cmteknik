
const Netcom = require('netcom');
const { Pool } = Netcom;

module.exports = function (RED) {
    function NetcomClientNode (config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.host = config.host;
        this.port = config.port;

        const maxClients = 3;
        const clientInfo = "Node-RED";

        this.pool = new Pool(this.host, this.port, clientInfo, maxClients);
    }

    RED.nodes.registerType("netcom-client", NetcomClientNode);
};

