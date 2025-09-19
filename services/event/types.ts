import {BaseSearchRequest, ResponsePagingSuccessType} from "@/utils/@types";
import {_EventStatus} from "@/services/event/const";

export type SearchEventParams = {
    province_code?: string;
    district_code?: string;
    ward_code?: string;
    lat?: number;
    lng?: number;
    status?: _EventStatus
}

export type SearchEventRequest = BaseSearchRequest<SearchEventParams>

export type EventListItem = {
    id: number;
    name: string;
    image_represent_path: string;
    address: string;
    day_represent: string;
}

export type EventListResponse = ResponsePagingSuccessType<EventListItem[]>
