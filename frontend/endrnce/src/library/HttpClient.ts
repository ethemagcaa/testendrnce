/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export interface HttpClientParameters {
    baseURL: string | undefined
    token?: string | undefined
    timeout?: number
}

export interface RequestInterceptor {
    token?: string | undefined
}

export interface RequestData<T> {
    successCallback: (response: any) => void
    errorCallback: (error: AxiosResponse | AxiosError | any) => void
    finallyCallback?: () => void
    data?: T
}

abstract class HttpClient {
    protected readonly instance: AxiosInstance;
    private interceptorRequest: number | undefined;
    private interceptorResponse: number | undefined;

    protected constructor(param: HttpClientParameters) {
        const { baseURL, token, timeout } = param;

        this.instance = axios.create({
            baseURL,
            timeout: timeout || 60000,
        });

        this.initializeRequestInterceptor({ token });
        this.initializeResponseInterceptor();
    }

    public initializeRequestInterceptor = (param: RequestInterceptor) => {
        if (this.interceptorRequest != null)
            this.instance.interceptors.request.eject(this.interceptorRequest);

        this.interceptorRequest = this.instance.interceptors.request.use((config: any) => {
            const configuration = config;

            if (param.token)
                configuration.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${param.token}`,
                };


            return configuration;
        });

        return this;
    };

    private initializeResponseInterceptor = () => {
        if (this.interceptorResponse != null)
            this.instance.interceptors.response.eject(this.interceptorResponse);

        this.interceptorResponse = this.instance.interceptors.response.use((config: AxiosResponse) => ({
            ...config,
        }));
    };
}

export default HttpClient;
