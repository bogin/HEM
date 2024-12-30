const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@stores': path.resolve(__dirname, 'src/stores'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@config': path.resolve(__dirname, 'src/config')
        }
    }
};