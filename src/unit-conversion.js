
module.exports = function(RED) {
    function UnitConversion(config) {
        RED.nodes.createNode(this, config);

        this.name = config.name;
        this.fromUnit = config.fromUnit;
        this.toUnit = config.toUnit;

        const node = this;

        node.on('input', function (msg) {
            let out = undefined;

            switch (node.fromUnit) {
            case "ms":
                    switch (node.toUnit) {
                    case "ms": out = msg.payload; break;
                    case "s": out = msg.payload / 1000; break;
                    case "min": out = msg.payload / 60000; break;
                    case "h": out = msg.payload / (60000 * 60); break;
                    default: break;
                    }
                    break;
            case "s":
                    switch (node.toUnit) {
                    case "ms": out = msg.payload * 1000; break;
                    case "s": out = msg.payload; break;
                    case "min": out = msg.payload / 60; break;
                    case "h": out = msg.payload / 3600; break;
                    default: break;
                    }
                    break;
            case "min":
                    switch (node.toUnit) {
                    case "ms": out = msg.payload * 60000; break;
                    case "s": out = msg.payload * 60; break;
                    case "min": out = msg.payload; break;
                    case "h": out = msg.payload / 60; break;
                    default: break;
                    }
                    break;
            case "h":
                    switch (node.toUnit) {
                    case "ms": out = msg.payload * (60000 * 60); break;
                    case "s": out = msg.payload * 3600; break;
                    case "min": out = msg.payload * 60; break;
                    case "h": out = msg.payload;
                    default: break;
                    }
                    break;
            case "K":
                    switch (node.toUnit) {
                    case "C": out = msg.payload - 273.15; break;
                    case "K": out = msg.payload; break;
                    default: break;
                    }
                    break;
            case "C":
                    switch (node.toUnit) {
                    case "C": out = msg.payload; break;
                    case "K": out = msg.payload + 273.15;
                    default: break;
                    }
                    break;
            default:
                    break;
            }

            if (out === undefined) {
                node.status({ fill: "red", shape: "dot", text: "illegal conversion" });
            } else {
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `${msg.payload} ${node.fromUnit} to ${out} ${node.toUnit}`
                });
                node.send({ payload: out });
            }
        });
    }

    RED.nodes.registerType("unit-conversion", UnitConversion);
}

