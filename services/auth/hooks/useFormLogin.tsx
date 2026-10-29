import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useTranslation} from "react-i18next";
import {LoginRequest} from "@/services/auth/types";

const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

const useFormLogin = () => {
    const {t} = useTranslation();

    return useForm<LoginRequest>({
        defaultValues: {
            username: "",
            password: "",
            organizer_id: ""
        },
        resolver: zodResolver(z.object({
            username: z
                .string()
                .trim()
                .min(1, { message: t('auth.error.invalid_username') })
                .refine(
                    (value) => {
                        const trimmed = value.trim();
                        const cleanPhone = trimmed.replace(/[\s.-]/g, '');
                        return (
                            z.string().email().safeParse(trimmed).success ||
                            PHONE_REGEX.test(cleanPhone)
                        );
                    },
                    {
                        message: t('auth.error.invalid_email_or_phone'),
                    }
                ),
            password: z
                .string()
                .min(8, { message: t('auth.error.invalid_password') }),
            organizer_id: z.string()
                .nonempty(t('auth.error.invalid_organizer'))
                .regex(/^\d+$/, t('auth.error.invalid_organizer')),
        })),
    })
}

export default useFormLogin;
