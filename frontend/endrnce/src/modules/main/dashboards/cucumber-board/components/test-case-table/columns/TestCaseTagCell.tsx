import React, { FC, useContext } from "react";
import { TagsContext } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { ServerTypeContext } from "@modules/main/dashboards/cucumber-board/context/server-type-context";

type Props = {
    tags: string
};

const TagsActionCell: FC<Props> = ({ tags }) => {
    const { tags: tagsWithPalette, setSelectedTagHandle, setSelectedTagHandleExcludeEnterpriseBsg, 
        setSelectedTagHandleBsgOnly } = useContext(TagsContext);
    const { isExcludeEnterpriseBsg, isBsgOnly } = useContext(ServerTypeContext);
    const array = tags.split(" ");

    const updateStateHandle = (tag: string) => {
        isExcludeEnterpriseBsg ? 
            setSelectedTagHandleExcludeEnterpriseBsg(tag) : (isBsgOnly ? 
                setSelectedTagHandleBsgOnly(tag) : setSelectedTagHandle(tag));
    };

    if(tagsWithPalette.length == 0)
        return (
            <></>
        );

    return (
        <>
            <div>
                {array.map((item,index) => {
                    const matchingTag = tagsWithPalette.find(tagObj => tagObj.name === item);
                    return (
                        <a
                            href={"#!"}
                            key={index}
                            onClick={() => updateStateHandle(item)}
                            className={"badge me-2 mb-2"}
                            style={{ color: matchingTag?.color.color, backgroundColor: matchingTag?.color.backgroundColor }}
                        >{item}
                        </a>
                    );
                })}
            </div>
        </>
    );
};

export default TagsActionCell;
