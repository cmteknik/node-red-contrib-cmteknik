
module.exports = function(RED) {
    function NetcomRead(config) {
        RED.nodes.createNode(this, config);

        this.name = config.name;
        this.device = config.device;
        this.parameter = config.parameter;
        this.dataType = config.dataType;

        let timerId = null;
        let connection = RED.nodes.getNode(config.connection)
        let pool = connection.pool;

        const node = this;

        node.handleNewValue = function(value) {
            node.status({ fill: "green", shape: "dot", text: value });
            node.send({ payload: value });
        }

        node.run = function () {
            let nc;
            pool.acquire()
                .then((client) => {
                    nc = client;
                    return nc.read(node.device, [ node.parameter ]);
                })
                .then((result) => {
                    pool.release(nc);
                    node.handleNewValue(result[node.parameter]);
                });
        }

        node.on('input', function (msg) {
            node.run();
        });
    }

    RED.nodes.registerType("netcom-read", NetcomRead);
}

