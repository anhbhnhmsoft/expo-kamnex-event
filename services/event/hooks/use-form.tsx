import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {CommentRequest} from "@/services/event/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { _EventCommentType } from "../const";


export const useFormComment = () => {
    const {t} = useTranslation();
    return useForm<CommentRequest>({
        defaultValues: {
            event_id: "",
            content: "",
            type: _EventCommentType.PUBLIC as _EventCommentType
        },
        resolver: zodResolver(z.object({
            event_id: z
                .string()
                .nonempty(t("common.common_error.data_not_found"))
                .regex(/^\d+$/, t("common.common_error.data_not_found")),
            content: z
                .string()
                .trim()
                .nonempty(t("event.error.invalid_comment") )
                .max(1000, t("event.error.invalid_comment")),
            type: z
                .nativeEnum(_EventCommentType)
        })),
    })
}