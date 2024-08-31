import React, { FC, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { PopularTagsResponseModel } from "@services/model/payload/response/cucumber/PopularTagsResponseModel";
import { TagsContext } from "@modules/main/dashboards/cucumber-board/context/tags-context";
import { RequestData } from "@library/HttpClient";
import { cucumberService } from "@services/CucumberService";
import { FormattedMessage } from "react-intl";
import toast from "react-hot-toast";
import { ServerTypeContext } from "@modules/main/dashboards/cucumber-board/context/server-type-context";


const PopularTagsWidget: FC = () => {
    const [tags, setTags] = useState<PopularTagsResponseModel[]>([]);
    const { tags: tagsWithPalette, setSelectedTagHandle, setSelectedTagHandleExcludeEnterpriseBsg,
        setSelectedTagHandleBsgOnly } = useContext(TagsContext);
    const { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly } = useContext(ServerTypeContext);

    useEffect(() => {
        (async () => getPopular5Tags())();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStateHandle = (tag: string) => {
        isExcludeEnterpriseBsg ?
            setSelectedTagHandleExcludeEnterpriseBsg(tag) : (isBsgOnly ?
                setSelectedTagHandleBsgOnly(tag) : setSelectedTagHandle(tag));
    };

    const getPopular5Tags = async () => {
        const request: RequestData<PopularTagsResponseModel> = {
            successCallback: (response) => {
                setTags(response);
            },
            errorCallback: (error: AxiosError) => {
                toast.error(error.message);
            }
        };
        await cucumberService.getInstance().getPopularTags(request, { isEnterprise, isExcludeEnterpriseBsg, isBsgOnly });
    };

    return (
        <>
            <div className={"rounded  p-10 pb-0 d-flex flex-wrap"}>
                <h5>
                    <span className="me-5 mb-5"><FormattedMessage id={"5 Most Used Tags:"} /> </span>
                </h5>
                {tagsWithPalette && (
                    tags.map((tag: PopularTagsResponseModel, index: number) => {
                        return (
                            <a
                                href={"#!"}
                                onClick={() => updateStateHandle(tag.name)}
                                className="badge me-5 mb-5"
                                key={index}
                                style={{
                                    color: tagsWithPalette.find(tagObj => tagObj.name === tag.name)?.color.color,
                                    backgroundColor: tagsWithPalette.find(tagObj => tagObj.name === tag.name)?.color.backgroundColor
                                }}>
                                {tag.name} ({tag.counter} times)
                            </a>
                        );
                    })
                )
                }
            </div>
        </>
    );
};

export { PopularTagsWidget };
