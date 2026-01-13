import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, router } from "expo-router";
import useToast from "@/services/app/hooks/useToast";
import useToastErrorHandler from "@/services/app/hooks/useToastErrorHandler";
import {
  useResendCodeMutation,
  useVerifyCodeMutation,
} from "@/services/auth/hooks/useMutationAuth";
import { ResendCodeRequest, VerifyCodeRequest } from "@/services/auth/types";
import { Alert } from "react-native";

export const CELL_COUNT = 6;

export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type UseVerifyFormParams = {
  username?: string;
  organizer_id?: number;
  type: string;
};
export function useVerifyForm({
  username,
  organizer_id,
  type,
}: UseVerifyFormParams) {
  const { t } = useTranslation();
  const { success } = useToast();
  const handleError = useToastErrorHandler();
  const { mutate } = useVerifyCodeMutation();
  const { mutate: resendMutate } = useResendCodeMutation();
  const [timer, setTimer] = useState(300);
  const [isCanResend, setIsCanResend] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { otp: "" },
  });
  const otpValue = watch("otp");
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // Cách sửa chuẩn nhất

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Xử lý gửi lại OTP
  const onResendOTP = useCallback(() => {
    if (!isCanResend) return;

    if (!username || !organizer_id) {
      Alert.alert(
        "Lỗi",
        "Không tìm thấy thông tin tài khoản. Vui lòng quay lại màn hình đăng ký và thử lại."
      );
      return;
    }

    const payload: ResendCodeRequest = {
      username,
      organizer_id: Number(organizer_id),
      type,
    };

    resendMutate(payload, {
      onSuccess: (res) => {
        setTimer(300);
        setIsCanResend(false);
        success({
          message: t("auth.page.verify.resend_success"),
        });
      },
      onError: (err) => {
        handleError(err);
      },
    });
  }, [
    isCanResend,
    username,
    organizer_id,
    type,
    resendMutate,
    success,
    t,
    handleError,
  ]);

  // Xử lý submit xác thực
  const onSubmit = useCallback(
    (data: { otp: string }) => {
      if (data.otp.length < CELL_COUNT) return;

      if (!username || !organizer_id) return;
      const newData: VerifyCodeRequest = {
        username: username,
        code: data.otp,
        organizer_id,
        type,
      };
      mutate(newData, {
        onSuccess: () => {
          success({ message: t("auth.page.verify.verify_success") });
          router.replace("/(auth)/login");
        },
        onError: (err) => {
          handleError(err);
        },
      });
    },
    [username, organizer_id, mutate, handleError, success, t]
  );

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    otpValue,
    errors,
    isSubmitting,
    isPending: false, // Thay bằng isPending từ mutation thật
    timer,
    isCanResend,
    onResendOTP,
    t,
  };
}
