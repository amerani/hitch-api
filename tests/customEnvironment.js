const NodeEnvironment = require('jest-environment-node');

class CustomEnvironment extends NodeEnvironment {
    constructor(config){
        super(config);
    }

    async setup() {
        await super.setup();
        this.global.Client = global.Client;
    }

    async teardown() {
        await super.teardown();
    }

    runScript(script) {
		return super.runScript(script);
	}
}

module.exports = CustomEnvironment;