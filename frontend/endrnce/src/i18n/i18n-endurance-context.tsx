import React, { FC, createContext, useContext } from "react";

const I18N_CONFIG_KEY = process.env.I18N_CONFIG_KEY ?? "i18nConfig";

interface LangProps {
    selectedLang: "tr" | "en";
}

const initialState: LangProps = {
    selectedLang: "en"
};

const getConfig = (): LangProps => {
    const ls = localStorage.getItem(I18N_CONFIG_KEY);

    if (ls)
        try {
            return JSON.parse(ls) as LangProps;
        } catch (er) {
            // console.error(er);
        }


    return initialState;
};

// Side effect
const setLanguage = (lang: string): void => {
    localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({ selectedLang: lang }));
    window.location.reload();
};

const I18nContext = createContext<LangProps>(initialState);

const useLang = (): string => useContext(I18nContext).selectedLang;

interface Props {
    children: React.ReactNode;
}

const I18nEnduranceContextProvider: FC<Props> = ({ children }) => {
    const lang = getConfig();

    return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>;
};

export { I18nEnduranceContextProvider, useLang, setLanguage };
