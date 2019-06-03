const path = require("path");
const FriendlyErrosWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
var os = require('os'),
    ip = '',
    ifaces = os.networkInterfaces() // 获取本机ip
out:
    for (var i in ifaces) {
        for (var j in ifaces[i]) {
            var val = ifaces[i][j]
            if (val.family === 'IPv4' && val.address !== '127.0.0.1') {
                ip = val.address
                break out
            }
        }
    }
const port = "9000";
module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            },
            exclude: [path.resolve(__dirname, 'node_modules')]
            //排除不需要编译的目录，提高编译速度
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 10000
            }
        }]
    },
    devServer: {
        noInfo: true,
        hot: true,
        host: ip,
        hotOnly: true,
        quiet: true,
        compress: true,
        port: port,
        openPage: "index.html",
        historyApiFallback: {
            rewrites: [{
                from: /./,
                to: './404.html'
            }]
        },
        // host:
        overlay: {
            errors: true,
            warnings: false
        }
    },
    plugins: [
        new FriendlyErrosWebpackPlugin({
            log: false,
            compilationSuccessInfo: {
                messages: [`You application is running here http://${ip}:${port}`],
                notes: ['Some additionnal notes to be displayed unpon successful compilation']
            },
            onErrors: function (severity, errors) {
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                notifier.notify({
                    title: "Webpack error",
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                    // icon: ICON
                });

                // You can listen to errors transformed and prioritized by the plugin
                // severity can be 'error' or 'warning'
            },
        }),
    ]
};