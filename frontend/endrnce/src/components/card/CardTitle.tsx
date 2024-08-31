import React, { FC } from "react";

type Props = {
    title: string
  }

const CardTitle: FC<Props> = ({ title }) => {
    return (
        <div className='card-header border-0'>
            <h3 className='card-title fw-bold text-gray-900'>{title}</h3>
        </div>
    );
};

export { CardTitle }; 