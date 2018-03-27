
module.exports = function(RED) {
    function NetcomWrite(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.device = config.device;
        this.parameter = config.parameter;
        this.dataType = config.dataType;

        let connection = RED.nodes.getNode(config.connection)
        let pool = connection.pool;

        const node = this;

        node.on('input', function (msg) {
            let nc;
            const value = msg.payload;

            pool.acquire()
                .then((client) => {
                    nc = client;
                    return nc.write(node.device, { [node.parameter]: value });
                })
                .then((result) => {
                    pool.release(nc);
                    const writtenValue = result[node.parameter];
                    if (writtenValue === null || writtenValue === undefined) {
                        node.status({ fill: "red", shape: "dot", text: "failed" });
                    } else {
                        node.status({ shape: "dot", fill: "green", text: writtenValue });
                    }
                    node.send({ payload: result });
                })
                .catch((error) => {
                    if (error.message) {
                        node.status({ fill: "red", shape: "dot", text: error.message });
                    } else {
                        node.status({ fill: "red", shape: "dot", text: error.toString() });
                    }
                });
        });
    }

    RED.nodes.registerType("netcom-write", NetcomWrite);
}

