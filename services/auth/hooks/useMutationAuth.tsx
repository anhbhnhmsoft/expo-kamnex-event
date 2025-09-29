import {useMutation} from "@tanstack/react-query";
import {EditInfoRequest, LoginRequest, RegisterRequest} from "@/services/auth/types";
import authAPI from "@/services/auth/api";


export const useMutationRegister = () => useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
});

export const useMutationLogin = () => useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
})

export const useMutationEditUser = () => useMutation({
    mutationFn: (data: EditInfoRequest) => authAPI.editInfo(data),
});

export const useMutationEditAvatar = () => useMutation({
    mutationFn: (data: FormData) => authAPI.editAvatar(data),
});

export const useMutationDeleteAvatar = () => useMutation({
    mutationFn: () => authAPI.deleteAvatar(),
});
