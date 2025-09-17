import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {useTranslation} from "react-i18next";
import {LoginRequest} from "@/services/auth/types";



const useFormLogin = () => {
    const {t} = useTranslation();

    return useForm<LoginRequest>({
        defaultValues: {
            email: "",
            password: "",
            organizer_id: 0
        },
        resolver: zodResolver(z.object({
            email: z.email({ message: t('auth.error.invalid_email') }),
            password: z
                .string()
                .min(8, { message: t('auth.error.invalid_password') })
                .regex(/[A-Z]/, { message: t('auth.error.invalid_password') })
                .regex(/[a-z]/, { message: t('auth.error.invalid_password') }),
            organizer_id: z.number().int().min(1, {message: t('auth.error.invalid_organizer')}),
        })),
    })
}

export default useFormLogin;
