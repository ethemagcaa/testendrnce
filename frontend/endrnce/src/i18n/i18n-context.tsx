import React, { FC } from "react";
import { IntlProvider } from "react-intl";

import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/locale-data/en";
import "@formatjs/intl-relativetimeformat/locale-data/tr";

import { useLang } from "@i18n/i18n-endurance-context";

import trMessages from "@i18n/messages/tr.json";
import enMessages from "@i18n/messages/en.json";

const allMessages: { [index: string]: Record<string, string> } = {
    tr: trMessages,
    en: enMessages
};

interface Props {
    children: React.ReactNode;
}

const I18nProvider: FC<Props> = ({ children }) => {
    const locale = useLang();
    const messages = allMessages[locale];

    return (
        <IntlProvider locale={locale} messages={messages}>
            {children}
        </IntlProvider>
    );
};

export default I18nProvider;
