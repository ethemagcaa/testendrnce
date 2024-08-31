/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React, { FC, useCallback, useContext, useEffect, useRef } from "react";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { TagsContext } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { DataTableContext } from "@components/data-table/context/data-table-context";
import { initialQueryState } from "@components/data-table/model/QueryStateModel";
import { ServerTypeContext } from "@modules/main/dashboards/cucumber-board/context/server-type-context";

function suggestionItemTemplate(this: {
        dropdownItem: (tagData: {
            class: string; value: string;
        }) => string;
    getAttributes(tagData: { class: string; value: string }): never;
}, tagData: { class: string; value: string; }){
    return `
         <div ${this.getAttributes(tagData)} class='tagify__dropdown__item ${tagData.class ? tagData.class : ""}'>
                <span>${tagData.value}</span>
        </div>
    `;
}

const TagInput: FC = () => {
    const tagifyRef = useRef<any>();
    const { tags, selectedTag, setSelectedTagHandle, selectedTagExcludeEnterpriseBsg, setSelectedTagHandleExcludeEnterpriseBsg, 
        selectedTagBsgOnly, setSelectedTagHandleBsgOnly } = useContext(TagsContext);
    const { updateState } = useContext(DataTableContext);
    const { isExcludeEnterpriseBsg, isBsgOnly } = useContext(ServerTypeContext);
    const selectedTagState =  isExcludeEnterpriseBsg ? 
        selectedTagExcludeEnterpriseBsg : (isBsgOnly ? 
            selectedTagBsgOnly : selectedTag);

    const onChangeHandle = useCallback((e: { detail: { value: string; }; }) => {
        const selectedTags = e.detail.value === "" ? [] : JSON.parse(e.detail.value);
        const tags = Array.prototype.map.call(selectedTags, s => s.name).toString();

        updateState({ filter: { tags } , ...initialQueryState });
    }, [updateState]);

    const onRemoveHandle = () => {
        isExcludeEnterpriseBsg ? 
            setSelectedTagHandleExcludeEnterpriseBsg("") : (isBsgOnly ? 
                setSelectedTagHandleBsgOnly("") : setSelectedTagHandle(""));
    };

    const transformTag = (tagData: { style: string; color: { color: string; backgroundColor: string; }; }) => {
        if(tagData.color)
            tagData.style = "--tag-text-color:" + tagData.color.color + ";--tag-bg:" + tagData.color.backgroundColor;
    };

    useEffect(() => {
        if (isExcludeEnterpriseBsg) {
            if(!tagifyRef.current || !selectedTagExcludeEnterpriseBsg)
                return;

            const tagArray = [];
            tagArray.push(tags.find(obj => obj.value == selectedTagExcludeEnterpriseBsg));

            tagifyRef.current.addTags(tagArray);
        } else if (isBsgOnly) {
            if(!tagifyRef.current || !selectedTagBsgOnly)
                return;

            const tagArray = [];
            tagArray.push(tags.find(obj => obj.value == selectedTagBsgOnly));

            tagifyRef.current.addTags(tagArray);
        } else {
            if(!tagifyRef.current || !selectedTag)
                return;

            const tagArray = [];
            tagArray.push(tags.find(obj => obj.value == selectedTag));

            tagifyRef.current.addTags(tagArray);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, selectedTagState]);

    const settings = {
        whitelist: tags,
        tagTextProp: "name", // very important since a custom template is used with this property as text
        enforceWhitelist: true,
        skipInvalid: true, // do not remporarily add invalid tags
        dropdown: {
            closeOnSelect: true,
            enabled: 1,
            searchKeys: ["name"]  // very important to set by which keys to search for suggesttions when typing
        },
        transformTag,
        templates: {
            dropdownItem: suggestionItemTemplate,
        },
    };

    if(tags.length === 0 )
        return <></>;

    return (
        <div className='d-flex flex-column flex-grow align-items-center position-relative my-1'>
            <Tags
                tagifyRef={tagifyRef}
                placeholder={"Type a tag..."}
                className={"form-control form-control-solid w-250px"}
                // @ts-ignore
                settings={settings}
                onChange={onChangeHandle}
                onRemove={onRemoveHandle}
            />
        </div>
    );
};

export default TagInput;
