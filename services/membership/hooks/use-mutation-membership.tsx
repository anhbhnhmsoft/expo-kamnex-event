import {useMutation} from "@tanstack/react-query";
import membershipApi from "@/services/membership/api";
import {RegisterMembershipRequest} from "@/services/membership/type";


export const useMutateRegisterMembership = () => {
    return useMutation({
        mutationFn: (data: RegisterMembershipRequest) => membershipApi.register(data),
    })
}
