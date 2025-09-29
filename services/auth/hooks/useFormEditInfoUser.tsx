import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {EditInfoRequest} from "@/services/auth/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";


const useFormEditInfoUser = () => {
    const {t} = useTranslation();

    return useForm<EditInfoRequest>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(z.object({
            name: z
                .string()
                .trim()
                .min(4, {message: t('account.error.invalid_name')})
                .max(50, {message: t('account.error.invalid_name')}),
            phone: z
                .string()
                .trim()
                .optional()
                .refine((v) => !v || /^0[0-9]{9,10}$/.test(v), {message: t('account.error.invalid_phone')}),
            address: z.string()
                .trim()
                .max(255, {message: t('account.error.invalid_name')})
                .optional(),
            introduce: z.string().trim().optional(),
            password: z
                .string()
                .trim()
                .optional()
                .refine((v) => !v || v.length >= 8, {message: t('account.error.invalid_password')}),
            confirm_password: z.string().trim().optional(),
        }).superRefine((data, ctx) => {
            if ((data.password && !data.confirm_password) || (data.password && data.confirm_password && data.password !== data.confirm_password)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["confirm_password"],
                    message: t('account.error.invalid_confirm_password'),
                });
            }
        })),
    })
}

export default useFormEditInfoUser;