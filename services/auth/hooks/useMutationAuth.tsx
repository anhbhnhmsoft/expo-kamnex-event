import {useMutation} from "@tanstack/react-query";
import {LoginRequest, RegisterRequest} from "@/services/auth/types";
import authAPI from "@/services/auth/api";


export const useMutationRegister = () => useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
});

export const useMutationLogin = () => useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
})