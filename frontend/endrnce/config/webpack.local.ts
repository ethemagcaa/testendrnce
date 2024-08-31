import { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "env/.development") });

import commonConfig from "./webpack.common";

const port = process.env.PORT;
const devServer: DevServerConfiguration = {
    port,
    historyApiFallback: true,
    open: false,
    hot: true
};

const localConfig: Configuration = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.tsx",
    output: {
        filename: "[name].[contenthash].js"
    },
    devServer,
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: {
                                filter: (url: string) => {
                                    if (url.includes("data:image/svg+xml"))
                                        return false;

                                    return true;
                                }
                            },
                            modules: {
                                auto: /\.module\.\w+$/i
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            title: "LOCAL - Endrnce",
            PUBLIC_URL: process.env.PUBLIC_URL
        })
    ]
};

const conf = merge<Configuration>(commonConfig, localConfig);

export default conf;
