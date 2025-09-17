import axios from "axios";
import {SecureStorage} from "@/utils/storages";
import {_StorageKey} from "@/utils/storages/key";
import {_HTTPStatus} from "@/utils/@types";
import ErrorAPIServer, { IValidationErrors } from "./error_type";
import i18next from "i18next";


export const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
    timeout: 10000, // Set a timeout for requests
    headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
    },
});

// Add a request interceptor
client.interceptors.request.use(
    async (config) => {
        // Add an authorization token if available
        const token = await SecureStorage.getItem<string>(_StorageKey.SECURE_AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
client.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorResponse = error.response;
        const errorData = error.response?.data;
        //Nếu có lỗi trả ra từ server
        if (errorResponse && errorData) {
            let messageError: string | null | undefined = errorData.message;
            let statusCodeResponse: number | null | undefined = errorResponse?.status;

            if (!messageError) messageError = "Đã xảy ra lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.";
            if (!statusCodeResponse) statusCodeResponse = 0;
            if (statusCodeResponse === _HTTPStatus.VALIDATE_FAILED_REQUEST) {
                const errorValidate: IValidationErrors = errorData.errors;
                return Promise.reject(new ErrorAPIServer(statusCodeResponse, messageError, errorResponse, errorValidate));
            } else {
                return Promise.reject(new ErrorAPIServer(statusCodeResponse, messageError, errorResponse));
            }
        } else if (error.request) {
            return Promise.reject(
                new ErrorAPIServer(
                    _HTTPStatus.BAD_REQUEST,
                    i18next.t("common_error.request_error"),
                    errorResponse
                )
            );
        } else {
            return Promise.reject(
                new ErrorAPIServer(
                    _HTTPStatus.INTERNAL_SERVER_ERROR,
                    i18next.t("common_error.server_error"),
                    errorResponse
                )
            );
        }
    }
);
