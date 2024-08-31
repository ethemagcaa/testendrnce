import React from "react";

type Props = {
    className: string
    description: string
    value: number
}

const CardsWidget20 = ({ className, description, value }: Props) => {
    return (
        <div
            className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}>
            <div className='card-header pt-5'>
                <div className='card-title d-flex flex-column'>
                    <span className='fs-2hx fw-bold text-white me-2 lh-5 ls-n2'>{value}</span>
                    <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{description}</span>
                </div>
            </div>
            <div className='card-body d-flex align-items-end pt-0'>
                <div className='d-flex align-items-center flex-column mt-3 w-100'></div>
            </div>
        </div>
    );
};

export { CardsWidget20 };
