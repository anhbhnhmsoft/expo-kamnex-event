import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {RegisterRequest} from "@/services/auth/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const useFormRegister = () => {
    const {t} = useTranslation();
    return useForm<RegisterRequest>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm_password: "",
            organizer_id: 0
        },
        resolver: zodResolver(z.object({
                name: z.string()
                    .min(4, {message: t('auth.error.invalid_name')})
                    .max(50, {message: t('auth.error.invalid_name')}),
                email: z.email({message: t('auth.error.invalid_email')}),
                password: z
                    .string()
                    .min(8, {message: t('auth.error.invalid_password')})
                    .regex(/[A-Z]/, {message: t('auth.error.invalid_password')})
                    .regex(/[a-z]/, {message: t('auth.error.invalid_password')}),
                confirm_password: z.string(),
                organizer_id: z.number().int().min(1, {message: t('auth.error.invalid_organizer')}),
            }).refine((data) => data.password === data.confirm_password, {
                message: t('auth.error.invalid_confirm_password'),
                path: ['confirm_password'],
            })
        ),
    });
}

export default useFormRegister;