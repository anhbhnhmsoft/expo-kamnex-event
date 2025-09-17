import {_LanguageCode, ResponseDataSuccessType} from "@/utils/@types";


export type GetOrganizersRequest = {
    key?: string,
    limit?: number,
    locate?: _LanguageCode
}

export type GetOrganizersResponse = ResponseDataSuccessType<{id:number, name:string}[]>