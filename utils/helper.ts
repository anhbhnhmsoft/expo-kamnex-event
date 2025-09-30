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
 export const formatCurrency = (price: string): string => {
    const amount = Number(price);
    if (isNaN(amount)) return price;
    return new Intl.NumberFormat("vi-VN").format(amount);
}

export const generateQRCodeImageUrl = (config: {
    bin: string,
    numberCode:string,
    name:string,
    money:string,
    desc: string,
}) => {
    return `https://img.vietqr.io/image/${config.bin}-${config.numberCode}-compact2.png?amount=${config.money}&addInfo=${config.desc}&accountName=${encodeURIComponent(config.name)}`;
}