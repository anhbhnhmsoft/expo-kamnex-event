import { useMutation } from "@tanstack/react-query";
import {
  EditInfoRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendCodeRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
} from "@/services/auth/types";
import authAPI from "@/services/auth/api";

export const useMutationRegister = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
  });

export const useMutationLogin = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
  });

export const useMutationEditUser = () =>
  useMutation({
    mutationFn: (data: EditInfoRequest) => authAPI.editInfo(data),
  });

export const useMutationEditAvatar = () =>
  useMutation({
    mutationFn: (data: FormData) => authAPI.editAvatar(data),
  });

export const useMutationDeleteAvatar = () =>
  useMutation({
    mutationFn: () => authAPI.deleteAvatar(),
  });
export const useMutationDeleteAccount = () =>
  useMutation({
    mutationFn: () => authAPI.deleteAccount(),
  });

export const useVerifyCodeMutation = () =>
  useMutation({
    mutationFn: (data: VerifyCodeRequest) => authAPI.verifyCode(data),
  });

export const useResendCodeMutation = () =>
  useMutation({
    mutationFn: (data: ResendCodeRequest) => authAPI.resendCode(data),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ResetPasswordRequest) => authAPI.resetPassword(data),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
  });
