import webpack, { Configuration } from "webpack";
import path from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as dotenv from "dotenv";
// eslint-disable-next-line import/default
import CopyPlugin from "copy-webpack-plugin";

dotenv.config({ path: path.join(__dirname, "..", ".env") });
const devMode = process.env.NODE_ENV !== "production";

const config: Configuration = {
    entry: path.join(__dirname, "../src", "index.tsx"),
    output: {
        path: path.join(__dirname, "../dist"),
        publicPath: "/",
        clean: true
    },
    cache: {
        type: "filesystem"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        plugins: [new TsconfigPathsPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ],
                        cacheCompression: false,
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(svg|woff?2|PNG|gif|png|jpe?g|ttf|eot|ico|otf)$/i,
                loader: "file-loader",
                options: {
                    name () {
                        if (devMode)
                            return "[path][name].[ext]";


                        return "[contenthash].[ext]";
                    },
                    outputPath: "resources",
                    esModule: false
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? "[name].css" : "[name].[contenthash].css",
            chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css"
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, "../public/css"), to: path.join(__dirname, "../dist/css") },
                { from: path.join(__dirname, "../public/media"), to: path.join(__dirname, "../dist/media") },
            ],
        }),
    ]
};

export default config;
