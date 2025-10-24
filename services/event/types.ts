import {BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";
import {_EventCommentType, _EventSeatStatus, _EventStatus, _EventUserHistory, _EventUserRole} from "@/services/event/const";

export type SearchEventParams = {
    province_code?: string;
    district_code?: string;
    ward_code?: string;
    lat?: number;
    lng?: number;
    exclude_id?: string;
    status?: _EventStatus;
    event_history_status?: _EventUserHistory;
    event_history_statuses?: _EventUserHistory[]
}

export type SearchEventRequest = BaseSearchRequest<SearchEventParams>

export type EventListItem = {
    id: string;
    name: string;
    status: _EventStatus;
    image_represent_path: string;
    address: string;
    day_represent: string;
    status_history: _EventUserHistory | null;
    free_to_join: boolean;
}

export type EventListResponse = ResponsePagingSuccessType<EventListItem[]>

export type EventDetail = {
    id: string;
    name: string;
    image_represent_path: string;
    address: string;
    short_description: string;
    description: string;
    day_represent: string;
    start_time: string;
    end_time: string;
    status: _EventStatus;
    latitude: string; // float
    longitude: string; // float
    free_to_join: boolean;
    user_event: {
        id: string;
        name: string;
        avatar_url: string | null;
        role: _EventUserRole;
    }[];
    organizer: {
        id: string;
        name: string;
        description: string;
        url_image: string | null;
    };
    schedules: {
        id: string;
        name: string;
    }[];
}

export type EventDetailResponse = ResponseDataSuccessType<EventDetail>;

export type EventUserHistory = {
    id: string;
    event_id: string;
    user_id: string;
    seat: {
        id: string;
        seat_code: string;
        area_id: string;
        area_name: string;
    } | null;
    ticket_code: string | null;
    status: _EventUserHistory;
};

export type RegisterEventHistoryRequest = {
    event_id: string;
    event_seat_id?: string;
    status: _EventUserHistory.BOOKED | _EventUserHistory.SEENED;
}

export type RegisterEventHistoryResponse = ResponseDataSuccessType<EventUserHistory> & {
    payment_required?: boolean;
    payment_data?: {
        transaction_id: string;
        payment_link_id: string;
        payment_url: string;
    };
}

export type CommentRequest = {
    event_id: string;
    content: string;
    type: _EventCommentType;
}

export type ListCommentRequest = BaseSearchRequest<{
    event_id?: string
    type?: _EventCommentType;
}>

export type CommentListResponse = ResponsePagingSuccessType<{
    id: string;
    user_comment: {
        id: string,
        name: string,
        avatar_url: string | null;
    },
    type: _EventCommentType,
    content: string,
    created_at: string
}[]>


export type EventAreaRequest = {
    event_id: string
}

export type EventAreaResponse = ResponseDataSuccessType<{
    id: string;
    name: string;
    capacity: number;
    vip: boolean;
    seat_available_count: number;
}[]>;

export type EventSeatRequest = {
    event_id: string;
    area_id:string;
}

export type EventSeatResponse = ResponseDataSuccessType<{
    id: string;
    seat_code: string;
    status: _EventSeatStatus
}[]>

export type RegisterDocumentRequest = {
    document_id: string;
}

export type RegisterDocumentResponse = {
    message: string;
    document?: {
        id: string;
        title: string;
        event_schedule_id: string;
        event_name: string;
        description: string;
        files: {
            id: string;
            file_path: string;
            file_name: string;
            file_size: string;
            file_type: string;
        }[];
    };
    data?: {
        trans_id: string;
        expired_at: string;
        config_pay: {
            name: string;
            bin: string;
            number: string;
        };
        money: string;
        description: string;
    };
}