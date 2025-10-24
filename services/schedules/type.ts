import {BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";


export type DetailScheduleResponse = ResponseDataSuccessType<{
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    documents: {
        id: string,
        title: string,
        allowDocument: boolean;
    }[];
}>

export type DocumentItem = {
    id: string;
    title: string;
    event_schedule_id: string;
    event_name:string;
    description: string;
    files: {
        id: string,
        file_path: string,
        file_name: string,
        file_size: string,
        file_type: string
    }
}

export type DetailDocumentResponse = ResponseDataSuccessType<DocumentItem>

export type ListDocumentRequest = BaseSearchRequest<object>

export type ListDocumentResponse = ResponsePagingSuccessType<DocumentItem[]>

export type LinkSupportResponse = ResponseDataSuccessType<{
    LINK_FACEBOOK_SUPPORT: string,
    LINK_ZALO_SUPPORT: string;
}>