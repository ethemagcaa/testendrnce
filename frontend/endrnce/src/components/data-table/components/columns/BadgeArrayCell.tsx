import React, { FC } from "react";

type Props = {
    arrayList: string[]
}

const BadgeArrayCell: FC<Props> = ({ arrayList }) => {
    return (
        <>
            {arrayList.map((text, index) => {
                return (
                    <div key={index} className="p-1">
                        <div className="badge badge-light fw-bolder">{text}</div>
                    </div>
                );
            })}
        </>
    );
};

export { BadgeArrayCell };
