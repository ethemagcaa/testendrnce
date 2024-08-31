import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import React from "react";

import enMessages from "@i18n/messages/en.json";

const renderWithReactIntl = (component: React.ReactNode, locale = "en", messages: Record<string, string> = enMessages) => {
    return render(
        <IntlProvider locale={locale} messages={messages}>
            {component}
        </ IntlProvider>
        , { wrapper: MemoryRouter });
};

export default renderWithReactIntl;
