import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "env/.production") });

import commonConfig from "./webpack.common";

const productionConfig: Configuration = {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js",
    },
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
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            title: "Endrnce",
            PUBLIC_URL: process.env.PUBLIC_URL
        })
    ]
};

const conf = merge<Configuration>(commonConfig, productionConfig);

export default conf;
