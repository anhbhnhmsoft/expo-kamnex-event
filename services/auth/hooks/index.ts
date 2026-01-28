import { useTranslation } from "react-i18next";
import { ForgotPasswordRequest, ResetPasswordRequest } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./useMutationAuth";
import useToast from "@/services/app/hooks/useToast";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import { router } from "expo-router";
import { _TypeVerify } from "../const";
import { useCallback } from "react";

const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

export const useForgotPasswordForm = () => {
  const { mutate } = useForgotPasswordMutation();
  const { t } = useTranslation();
  const handleError = useToastErrorHandler();
  const { success } = useToast();
  const form = useForm<ForgotPasswordRequest>({
    defaultValues: {
      username: "",
      organizer_id: "",
    },
    resolver: zodResolver(
      z.object({
        username: z
          .string()
          .min(1, { message: t("auth.error.invalid_username") })
          .refine(
            (value) =>
              z.string().email().safeParse(value).success ||
              PHONE_REGEX.test(value),
            {
              message: t("auth.error.invalid_email_or_phone"),
            },
          ),
        organizer_id: z
          .string()
          .nonempty(t("auth.error.invalid_organizer"))
          .regex(/^\d+$/, t("auth.error.invalid_organizer")),
      }),
    ),
  });
  const submit = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: (res) => {
        success({
          message: res.message,
        });
        router.push({
          pathname: "/(auth)/verify-otp",
          params: {
            username: data.username,
            organizer_id: data.organizer_id.toString(),
            type: _TypeVerify.FORGOT_PASSWORD,
          },
        });
        form.reset();
      },
      onError: (error) => {
        handleError(error);
      },
    });
  });

  return {
    form,
    submit,
  };
};

export const useResetPasswordForm = (reset_token: string) => {
  const { t } = useTranslation();
  const { mutate } = useResetPasswordMutation();
  const handleError = useToastErrorHandler();
  const { success } = useToast();
  const form = useForm<ResetPasswordRequest>({
    defaultValues: {
      reset_token: reset_token,
      password: "",
      confirm_password: "",
    },
    resolver: zodResolver(
      z.object({
        reset_token: z
          .string()
          .min(1, { message: t("auth.error.invalid_reset_token") }),
        password: z
          .string()
          .min(8, { message: t("auth.error.invalid_password") }),
        confirm_password: z
          .string()
          .min(8, { message: t("auth.error.invalid_confirm_password") }),
      }),
    ),
  });
  const submit = useCallback(
    (data: ResetPasswordRequest) => {
      mutate(data, {
        onSuccess: (res) => {
          success({
            message: res.message || "Đặt lại mật khẩu thành công",
          });
          router.replace("/login");
        },
        onError: (err: any) => {
          handleError(err);
        },
      });
    },
    [mutate, success, handleError],
  );

  return {
    form,
    submit,
  };
};
