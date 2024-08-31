import React, { FC } from "react";

type Props = {
  text?: string
}

const BadgeCell: FC<Props> = ({ text }) => (
    <div className='badge badge-light fw-bolder'>{text}</div>
);

export { BadgeCell };
