
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
            if (value === undefined || value === null) {
                node.status({ fill: "red", shape: "dot", text: "failed" });
            } else {
                node.status({ fill: "green", shape: "dot", text: value });
                node.send({ payload: value });
            }
        }

        node.run = function () {
            let nc;
            let readList;

            if (node.dataType) {
                readList = { [node.parameter]: { t: node.dataType } }
            } else {
                readList = [ node.parameter ];
            }

            pool.acquire()
                .then((client) => {
                    nc = client;
                    return nc.read(node.device, readList);
                })
                .then((result) => {
                    pool.release(nc);
                    node.handleNewValue(result[node.parameter]);
                })
                .catch((error) => {
                    // console.log("######### CAUGHT AN ERROR ##################", error);
                    if (error.message) {
                        // An error response from Netcomd
                        node.status({ fill: "red", shape: "dot", text: error.message });
                    } else {
                        // A Node error type
                        node.status({ fill: "red", shape: "dot", text: error.toString()});
                    }
                });
        }

        node.on('input', function (msg) {
            node.run();
        });
    }

    RED.nodes.registerType("netcom-read", NetcomRead);
}

