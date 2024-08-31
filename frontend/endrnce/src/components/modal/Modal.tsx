import React, { FC } from "react";
import { Modal as BSModal } from "react-bootstrap";

import { Icon } from "@components/icon/Icon";
import { WithChildren } from "@library/Types";

type Props = {
    show: boolean
    handleClose: () => void
    backdrop?: boolean,
    title: string,
    dialogClassName?: string
}

const Modal: FC<Props & WithChildren> = ({
    show,
    handleClose,
    backdrop ,
    dialogClassName,
    title,
    children
}) => {
    dialogClassName = dialogClassName || "modal-dialog modal-dialog-centered mw-900px";
    backdrop = backdrop || true;

    return (
        <BSModal
            tabIndex={-1}
            aria-hidden='true'
            dialogClassName= {dialogClassName}
            show={show}
            onHide={handleClose}
            backdrop={backdrop}
        >
            <div className='modal-header'>
                <h2>{title}</h2>
                {/* begin::Close */}
                <div
                    className='btn btn-sm btn-icon btn-active-color-primary'
                    role={"presentation"}
                    onClick={handleClose}
                >
                    <Icon className='fs-1' iconName='cross' />
                </div>
                {/* end::Close */}
            </div>

            <div className='modal-body py-lg-10 px-lg-10 scroll-y'>
                {children}
            </div>
        </BSModal>
    );
};

export { Modal };
