import {useMutation} from "@tanstack/react-query";
import eventApi from "@/services/event/api";
import {RegisterEventHistoryRequest} from "@/services/event/types";


export const useMutateRegisterEventHistory = () => {
    return useMutation({
        mutationFn: (data: RegisterEventHistoryRequest) => eventApi.registerEventHistory(data),
    })
}