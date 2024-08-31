import React, { createContext, FC, useEffect, useState } from "react";
import { WithChildren } from "@library/Types";
import { RequestData } from "@library/HttpClient";
import { AxiosError } from "axios";
import { TagResponseModel } from "@services/model/payload/response/cucumber/TagResponseModel";
import { cucumberService } from "@services/CucumberService";
import toast from "react-hot-toast";

interface Palette {
    color: string,
    backgroundColor: string
}

export interface TagsWithPalette {
    value: string,
    name: string,
    color: Palette
}

type Props = {
    tags: TagsWithPalette[],
    selectedTag: string,
    setSelectedTagHandle: (tag: string) => void,
    selectedTagExcludeEnterpriseBsg: string,
    setSelectedTagHandleExcludeEnterpriseBsg: (tag: string) => void,
    selectedTagBsgOnly: string,
    setSelectedTagHandleBsgOnly: (tag: string) => void
}

const initialTag: Props = {
    tags: [],
    selectedTag: "",
    setSelectedTagHandle: () => {},
    selectedTagExcludeEnterpriseBsg: "",
    setSelectedTagHandleExcludeEnterpriseBsg: () => {},
    selectedTagBsgOnly: "",
    setSelectedTagHandleBsgOnly: () => {}
};

const TagsContext = createContext<Props>(initialTag);

const TagsProvider: FC<WithChildren> = ({ children }) => {
    const [tags, setTags] = useState<TagsWithPalette[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [selectedTagExcludeEnterpriseBsg, setSelectedTagExcludeEnterpriseBsg] = useState<string>("");
    const [selectedTagBsgOnly, setSelectedTagBsgOnly] = useState<string>("");
    const tagsWithPalette: TagsWithPalette[] = [];
    // https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
    const colorPalette = [
        { color: "#C51162", backgroundColor: "#F8BBD080" },
        { color: "#AA00FF", backgroundColor: "#E1BEE780" },
        { color: "#6200EA", backgroundColor: "#D1C4E980" },
        { color: "#304FFE", backgroundColor: "#C5CAE980" },
        { color: "#2962FF", backgroundColor: "#BBDEFB80" },
        { color: "#01579B", backgroundColor: "#B3E5FC80" },
        { color: "#006064", backgroundColor: "#B2EBF280" },
        { color: "#00BFA5", backgroundColor: "#B2DFDB80" },
        { color: "#1B5E20", backgroundColor: "#C8E6C980" },
        { color: "#33691E", backgroundColor: "#DCEDC880" },
        { color: "#827717", backgroundColor: "#F0F4C380" },
        { color: "#F57F17", backgroundColor: "#FFF9C480" },
        { color: "#FF6F00", backgroundColor: "#FFECB380" },
        { color: "#E65100", backgroundColor: "#FFE0B280" },
        { color: "#212121", backgroundColor: "#F5F5F580" },
        { color: "#BF360C", backgroundColor: "#FFCCBC80" },
        { color: "#263238", backgroundColor: "#CFD8DC80" },
        { color: "#3E2723", backgroundColor: "#D7CCC880" },
        { color: "#B71C1C", backgroundColor: "#E5737380" },
        { color: "#880E4F", backgroundColor: "#F0629280" },
        { color: "#4A148C", backgroundColor: "#BA68C880" },
        { color: "#311B92", backgroundColor: "#9575CD80" },
        { color: "#1A237E", backgroundColor: "#7986CB80" },
        { color: "#0D47A1", backgroundColor: "#64B5F680" },
        { color: "#01579B", backgroundColor: "#4FC3F780" },
        { color: "#006064", backgroundColor: "#4DD0E180" },
        { color: "#004D40", backgroundColor: "#4DB6AC80" },
        { color: "#1B5E20", backgroundColor: "#81C78480" },
        { color: "#33691E", backgroundColor: "#AED58180" },
        { color: "#827717", backgroundColor: "#DCE77580" },
        { color: "#F57F17", backgroundColor: "#FFF17680" },
        { color: "#FF6F00", backgroundColor: "#FFD54F80" },
        { color: "#E65100", backgroundColor: "#FFB74D80" },
        { color: "#BF360C", backgroundColor: "#FF8A6580" },
        { color: "#3E2723", backgroundColor: "#A1887F80" },
        { color: "#212121", backgroundColor: "#E0E0E080" },
        { color: "#263238", backgroundColor: "#90A4AE80" },
        { color: "#37474F", backgroundColor: "#B0BEC580" },
        { color: "#4E342E", backgroundColor: "#BCAAA480" },
        { color: "#FF8F00", backgroundColor: "#FFE08280" },
        { color: "#558B2F", backgroundColor: "#C5E1A580" },
        { color: "#00695C", backgroundColor: "#80CBC480" },
        { color: "#00838F", backgroundColor: "#80DEEA80" },
    ];

    useEffect(() => {
        (async () => {
            await getTags();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setSelectedTagHandle = (tag: string) => {
        setSelectedTag(tag);
    };

    const setSelectedTagHandleExcludeEnterpriseBsg = (tag: string) => {
        setSelectedTagExcludeEnterpriseBsg(tag);
    };

    const setSelectedTagHandleBsgOnly = (tag: string) => {
        setSelectedTagBsgOnly(tag);
    };

    const getTags = async () => {
        const request: RequestData<TagResponseModel[]> = {
            successCallback: (response) => {
                response.map((currElement: TagResponseModel, index: number) => {
                    tagsWithPalette.push({
                        value: currElement.name,
                        name: currElement.name,
                        color: {
                            color: colorPalette[index % 41].color,
                            backgroundColor: colorPalette[index % 41].backgroundColor
                        }
                    });
                });
                setTags(tagsWithPalette);
            },
            errorCallback: (error: AxiosError) => {
                toast.error("Error" + error.toString());
            }
        };
        await cucumberService.getInstance().getTags(request);
    };

    return (
        <TagsContext.Provider
            value={{
                tags,
                selectedTag,
                setSelectedTagHandle,
                selectedTagExcludeEnterpriseBsg,
                setSelectedTagHandleExcludeEnterpriseBsg,
                selectedTagBsgOnly,
                setSelectedTagHandleBsgOnly
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};

export { TagsProvider, TagsContext };
