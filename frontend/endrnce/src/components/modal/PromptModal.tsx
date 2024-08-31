import React, { FC } from "react";

import { WithChildren } from "@library/Types";
import { Modal } from "@components/modal/Modal";

type Props = {
    show: boolean
    handleClose: () => void
    backdrop?: boolean,
    title: string,
    dialogClassName?: string
}

const PromptModal: FC<Props & WithChildren> = ({
    show,
    handleClose,
    backdrop ,
    dialogClassName,
    title,
    children
}) => {
    dialogClassName = dialogClassName || "modal-dialog modal-dialog-centered";
    backdrop = backdrop || true;

    return (
        <Modal
            title={title}
            show={show}
            handleClose={handleClose}
            dialogClassName={dialogClassName}
            backdrop={backdrop}
        >
            <div className={"table-responsive"}>
                <div className="text-center fs-5">
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export { PromptModal };
