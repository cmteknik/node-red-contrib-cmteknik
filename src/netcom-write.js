
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
            node.log("VALUE");
            node.log(value);
            pool.acquire()
                .then((client) => {
                    nc = client;
                    return nc.write(node.device, { [node.parameter]: value });
                })
                .then((result) => {
                    pool.release(nc);
                    node.status({ shape: "dot", fill: "green", text: value });
                    node.send({ payload: result });
                });
        });
    }

    RED.nodes.registerType("netcom-write", NetcomWrite);
}

