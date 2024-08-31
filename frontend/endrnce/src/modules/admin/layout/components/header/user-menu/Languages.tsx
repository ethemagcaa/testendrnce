/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/no-static-element-interactions */
import clsx from "clsx";
import React, { FC } from "react";

import useAsset from "@hooks/use-asset";
import { setLanguage, useLang } from "@i18n/i18n-endurance-context";
import { FormattedMessage } from "react-intl";

const Languages: FC = () => {
    const toAbsoluteUrl = useAsset();
    const lang = useLang();

    const languages = [
        {
            lang: "en",
            name: "English",
            flag: toAbsoluteUrl("/media/flags/united-states.svg"),
        },
        {
            lang: "tr",
            name: "Türkçe",
            flag: toAbsoluteUrl("/media/flags/turkey.svg"),
        },
    ];
    const currentLanguage = languages.find((x) => x.lang === lang);

    return (
        <div
            className='menu-item px-5'
            data-kt-menu-trigger='hover'
            data-kt-menu-placement='left-start'
            data-kt-menu-flip='bottom'
        >
            <a href="#!" className='menu-link px-5'>
                <span className='menu-title position-relative'>
                    <FormattedMessage id="Language" />
                    <span className='fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
                        {currentLanguage?.name}{" "}
                        <img
                            className='w-15px h-15px rounded-1 ms-2'
                            src={currentLanguage?.flag}
                            alt={currentLanguage?.name}
                        />
                    </span>
                </span>
            </a>

            <div className='menu-sub menu-sub-dropdown w-175px py-4'>
                {languages.map((l) => (
                    <div
                        className='menu-item px-3'
                        key={l.lang}
                        onClick={() => {
                            setLanguage(l.lang);
                        }}
                        onKeyDown={() => {
                            setLanguage(l.lang);
                        }}
                    >
                        <a
                            href="#!"
                            className={clsx("menu-link d-flex px-5", { active: l.lang === currentLanguage?.lang })}
                        >
                            <span className='symbol symbol-20px me-4'>
                                <img className='rounded-1' src={l.flag} alt={l.name}/>
                            </span>
                            {l.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Languages };
