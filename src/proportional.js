
module.exports = function(RED) {
    function Proportional(config) {
        RED.nodes.createNode(this, config);

        this.name = config.name;
        this.x1 = Number(config.x1);
        this.y1 = Number(config.y1);
        this.x2 = Number(config.x2);
        this.y2 = Number(config.y2);

        const node = this;

        node.on('input', function (msg) {
            const value = Number(msg.payload);
            const { x1, x2, y1, y2 } = node;
            let propValue;

            if (value < x1) {
                propValue = y1;
            } else if (value > x2) {
                propValue = y2;
            } else {
                if (x2 - x1 == 0) {
                    // To avoid division by zero
                    propValue = y1;
                } else {
                    propValue = y1 + ((y2 - y1) / (x2 - x1)) * (value - x1);
                }
            }

            node.status({ fill: "green", shape: "dot", text: `${value} => ${propValue}` });
            node.send({ payload: propValue });
        });
    }

    RED.nodes.registerType("proportional", Proportional);
}

