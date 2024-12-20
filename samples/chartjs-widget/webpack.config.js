const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
    return {
        mode: 'development',
        watch: !!env.watch,
        entry: './src/chartJS.js',
        output: {
            filename: 'chartJS.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "src" },
                ],
            }),
        ],
    };
}
