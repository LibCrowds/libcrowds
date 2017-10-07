const path = require('path');

module.exports = {
    process(src, filename, config, options) {
        console.info('Assets transformer processing');
        return `module.exports = JSON.stringify(path.basename(filename));`;
    },
};