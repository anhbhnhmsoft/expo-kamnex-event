import {useMutation} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {CommentRequest, RegisterEventHistoryRequest, RegisterDocumentRequest} from "@/services/event/types";


export const useMutateRegisterEventHistory = () => {
    return useMutation({
        mutationFn: (data: RegisterEventHistoryRequest) => eventApi.registerEventHistory(data),
    })
}

export const useMutateCommentEvent = () => {
    return useMutation({
        mutationFn: (data: CommentRequest) => eventApi.comment(data),
    })
}

export const useMutateRegisterDocument = () => {
    return useMutation({
        mutationFn: (data: RegisterDocumentRequest) => eventApi.registerDocument(data),
    })
}