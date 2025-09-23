import {BaseSearchRequest, ResponseDataSuccessType, ResponsePagingSuccessType} from "@/utils/@types";
import {_EventStatus, _EventUserHistory, _EventUserRole} from "@/services/event/const";

export type SearchEventParams = {
    province_code?: string;
    district_code?: string;
    ward_code?: string;
    lat?: number;
    lng?: number;
    exclude_id?: string;
    status?: _EventStatus
}

export type SearchEventRequest = BaseSearchRequest<SearchEventParams>

export type EventListItem = {
    id: string;
    name: string;
    image_represent_path: string;
    address: string;
    day_represent: string;
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
    status: _EventStatus,
    latitude: string; // float
    longitude: string; // float
    user_event: {
        id: string;
        name: string;
        avatar_url: string | null
        role: _EventUserRole
    }[];
    organizer: {
        id: string;
        name: string;
        description: string;
        url_image: string | null;
    };
    schedules: {
        id: string,
        name: string
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
        area_name: string
    } | null;
    ticket_code: string | null
    status: _EventUserHistory
}

export type RegisterEventHistoryRequest = {
    event_id: string;
    event_seat_id?: string;
    status: _EventUserHistory.BOOKED | _EventUserHistory.SEENED
}

export type RegisterEventHistoryResponse = ResponseDataSuccessType<EventUserHistory>