import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {CommentRequest, EventPollQuestion} from "@/services/event/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {_EventCommentType, _EventPollQuestionType} from "../const";
import {useMemo} from "react";

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

export const useFormSubmitPoll = (questions?: EventPollQuestion[]) => {
    const {t} = useTranslation();
    const { validationSchema, initialValues } = useMemo(() => {
        const shape: Record<string, z.ZodTypeAny> = {};
        const defaults: Record<string, any> = {};

        (questions || []).forEach((q) => {
            // --- Xử lý Schema & Default Value cho từng loại ---
            if (q.type === _EventPollQuestionType.MULTIPLE) {
                // Type 1: Schema là Mảng, Default là []
                shape[q.id] = z
                    .array(z.string())
                    .min(1, { message: t("event.error.invalid_poll_answer") });

                defaults[q.id] = []; // Quan trọng: khởi tạo mảng rỗng
            } else if (q.type === _EventPollQuestionType.OPEN_ENDED) {
                // Type 2: Schema là String, Default là ""
                shape[q.id] = z
                    .string()
                    .min(1, { message: t("event.error.invalid_poll_answer_open_ended") });

                defaults[q.id] = ""; // Quan trọng: khởi tạo chuỗi rỗng
            }
        });

        return {
            validationSchema: z.object(shape),
            initialValues: defaults
        };
    }, [questions, t]);
    return useForm({
        defaultValues: initialValues,
        resolver: zodResolver(validationSchema), 
    })
}
