import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {RegisterRequest} from "@/services/auth/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;


const useFormRegister = () => {
    const {t} = useTranslation();
    return useForm<RegisterRequest>({
        defaultValues: {
            name: "",
            username: "",
            password: "",
            confirm_password: "",
            organizer_id: ""
        },
        resolver: zodResolver(z.object({
                name: z.string()
                    .min(4, {message: t('auth.error.invalid_name')})
                    .max(50, {message: t('auth.error.invalid_name')}),
                username: z
                    .string()
                    .min(1, { message: t('auth.error.invalid_username') })
                    .refine(
                        (value) =>
                            z.string().email().safeParse(value).success ||
                            PHONE_REGEX.test(value),
                        {
                            message: t('auth.error.invalid_email_or_phone'),
                        }
                    ),
                password: z
                    .string()
                    .min(8, {message: t('auth.error.invalid_password')}),
                confirm_password: z.string(),
            organizer_id: z.string()
                .nonempty(t('auth.error.invalid_organizer'))
                .regex(/^\d+$/, t('auth.error.invalid_organizer')),
            }).refine((data) => data.password === data.confirm_password, {
                message: t('auth.error.invalid_confirm_password'),
                path: ['confirm_password'],
            })
        ),
    });
}

export default useFormRegister;