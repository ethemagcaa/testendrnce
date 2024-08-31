import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@react-query/queryClient";
import { Toaster } from "react-hot-toast";
// import reportWebVitals from "./reportWebVitals";

import "@assets/sass/style.react.scss";
import "@assets/fonticon/fonticon.css";
import "@assets/keenicons/duotone/style.css";
import "@assets/keenicons/outline/style.css";
import "@assets/keenicons/solid/style.css";

import "@assets/sass/style.scss";
import "@assets/sass/plugins.scss";

import { I18nEnduranceContextProvider } from "@i18n/i18n-endurance-context";
import I18nProvider from "@i18n/i18n-context";
import { AppRoutes } from "@routing/AppRoutes";
import { store } from "@store/store";
import { AuthContextProvider } from "@modules/admin/auth/context/auth-context";
import { ToastsProvider } from "@context/toasts/toasts-context";

const container = document.getElementById("root");
if (container)
    createRoot(container).render(
        <Provider store={store}>
            <ToastsProvider toastContainerProps={{ position: "top-end", className: "position-fixed top-0 end-0 p-3" }}>
                <>
                    <Toaster position="top-right" />
                    <QueryClientProvider client={queryClient}>
                        <I18nEnduranceContextProvider>
                            <I18nProvider>
                                <AuthContextProvider>
                                    <AppRoutes/>
                                </AuthContextProvider>
                            </I18nProvider>
                        </I18nEnduranceContextProvider>
                        <ReactQueryDevtools initialIsOpen={false}/>
                    </QueryClientProvider>
                </>
            </ToastsProvider>
        </Provider>
    );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
