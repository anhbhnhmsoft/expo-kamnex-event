import dayjs from 'dayjs';
import "dayjs/locale/vi";
import "dayjs/locale/en";
import {_LanguageCode} from "@/utils/@types";

export const formatDate = (date:string | Date, locale: _LanguageCode = _LanguageCode.VI) =>{
    dayjs.locale(locale);
    return locale === _LanguageCode.VI
        ? dayjs(date).format("dd, D [Th]M, YYYY")
        : dayjs(date).format("ddd, D MMM, YYYY");
}