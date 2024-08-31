/* eslint-disable react/react-in-jsx-scope */
import React, {
    createContext,
    forwardRef,
    RefObject,
    useContext, useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import { Toast, ToastContainer, ToastProps } from "react-bootstrap";

import { ToastIdType, ToastOptions, ToastOptionsWithId, ToastPropsOmitBg, ToastsHandle } from "./types";

import type { ToastContainerProps } from "react-bootstrap";

const ToastsContext = createContext<RefObject<ToastsHandle> | undefined>(undefined);

// eslint-disable-next-line react/display-name
const Toasts = forwardRef<ToastsHandle,
    { toastContainerProps?: ToastContainerProps; limit?: number }>((props, ref) => {
        const [toasts, setToasts] = useState<ToastOptionsWithId[]>([]);

        useImperativeHandle(ref, () => ({
            show: (toastOptionsWithId: ToastOptionsWithId) => {
                setToasts((state) => {
                    const clone = [...state];
                    clone.push(toastOptionsWithId);
                    if (props.limit && clone.length > props.limit)
                        clone.shift();

                    return clone;
                });
            },

            hide: (id: ToastIdType) => {
                setToasts((state) => [...state].filter((t) => t.id !== id));
            },
        }));

        const { toastContainerProps } = props;
        return (
            <ToastContainer {...toastContainerProps}>
                {toasts.map((toast) => {
                    const { headerContent, toastHeaderProps } = toast;
                    const header = <Toast.Header {...toastHeaderProps}>{headerContent}</Toast.Header>;

                    const { bodyContent, toastBodyProps } = toast;
                    const body = <Toast.Body {...toastBodyProps}>{bodyContent}</Toast.Body>;

                    const { toastProps } = toast;
                    const { onClose } = toastProps ?? {};
                    delete toastProps?.onClose;
                    return (
                        <Toast
                            key={toast.id}
                            {...toastProps}
                            onClose={() => {
                                setToasts((toastsState) => toastsState.filter((t) => t.id !== toast.id));
                                onClose?.();
                            }}
                        >
                            {header}
                            {body}
                        </Toast>
                    );
                })}
            </ToastContainer>
        );
    });

const ToastsProvider = ({
    children,
    toastContainerProps,
    limit,
}: {
    children: JSX.Element;
    toastContainerProps?: ToastContainerProps;
    limit?: number;
}) => {
    const toastsRef = useRef<ToastsHandle>(null);

    return (
        <ToastsContext.Provider value={toastsRef}>
            {children}
            <Toasts ref={toastsRef} toastContainerProps={toastContainerProps} limit={limit}></Toasts>
        </ToastsContext.Provider>
    );
};

let toastId: ToastIdType = 0;

const useToasts = () => {
    const [toastOptsQueue, setToastOptsQueue] = useState<ToastOptionsWithId[]>([]);

    const ctx = useContext(ToastsContext);
    if (ctx === undefined)
        throw Error(
            "`useToasts` must be used inside of a `ToastsProvider`, " +
            "otherwise it will not function correctly.",
        );


    const api = useMemo(() => {
        const show = (toastOptions: ToastOptions<ToastProps>): ToastIdType => {
            const id = toastId++;
            setToastOptsQueue((q) => [...q, { ...toastOptions, id }]);
            return id;
        };
        const hide = (id: ToastIdType) => {
            ctx.current?.hide(id);
        };

        const info = (toastOptions: ToastOptions<ToastPropsOmitBg>): ToastIdType => {
            return show(_withBg(toastOptions, "info"));
        };
        const primary = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "primary"));
        };
        const secondary = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "secondary"));
        };
        const success = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "success"));
        };
        const danger = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "danger"));
        };
        const warning = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "warning"));
        };
        const dark = (toastOptions: ToastOptions<ToastPropsOmitBg>) => {
            return show(_withBg(toastOptions, "dark"));
        };
        const light = (toastOptions: ToastOptions<ToastPropsOmitBg>): ToastIdType => {
            return show(_withBg(toastOptions, "light"));
        };

        const _withBg = (toastOptions: ToastOptions<ToastPropsOmitBg>, bg: ToastProps["bg"]) => {
            const { toastProps } = toastOptions;
            const toastPropsWithBg = { ...toastProps, bg };
            return {
                ...toastOptions,
                toastProps: toastPropsWithBg,
            };
        };
        return {
            show,
            hide,
            info,
            primary,
            secondary,
            success,
            danger,
            warning,
            dark,
            light,
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.current]);

    useEffect(() => {
        const { current } = ctx;
        if (current !== null && toastOptsQueue.length) {
            toastOptsQueue.forEach((opts) => {
                current.show(opts);
            });

            setToastOptsQueue([]);
        }
    }, [ctx, toastOptsQueue]);

    return api;
};

export { ToastsProvider, useToasts };
