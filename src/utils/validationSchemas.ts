import * as Yup from 'yup';

export const getSignInSchema = (dict: any) => Yup.object().shape({
    email: Yup.string()
        .email(dict.validation.emailInvalid)
        .required(dict.validation.emailRequired),
    password: Yup.string()
        .required(dict.validation.passwordRequired),
});

export const getSignUpSchema = (dict: any) => Yup.object().shape({
    fullname: Yup.string().required(dict.validation.fullNameRequired),
    email: Yup.string()
        .email(dict.validation.emailInvalid)
        .required(dict.validation.emailRequired),
    phone: Yup.string()
        .matches(/^\+?[0-9]{10,15}$/, dict.validation.phoneInvalid)
        .required(dict.validation.phoneRequired),
    password: Yup.string()
        .min(8, dict.validation.passwordMin)
        .required(dict.validation.passwordRequired),
    agreeToPrivacy: Yup.boolean()
        .oneOf([true], dict.validation.privacyPolicyRequired)
        .required(dict.validation.privacyPolicyRequired)
});

export const getProfileSchema = (dict: any) => Yup.object().shape({
    full_name: Yup.string().required(dict.validation.fullNameRequired),
    email: Yup.string().email(dict.validation.emailInvalid).required(dict.validation.emailRequired),
    phone: Yup.string().matches(/^\+?[0-9()\s-]{7,20}$/, dict.validation.phoneInvalid).nullable(),
    password: Yup.string()
        .min(6, dict.validation.passwordMin)
        .nullable(),

    currentPassword: Yup.string().when('password', {
        is: (password: any) => !!password,
        then: (schema) =>
            schema
                .required(dict.validation.currentPasswordRequired)
                .notOneOf([Yup.ref('password')], dict.validation.passwordSame),
        otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when('password', {
        is: (password: any) => !!password,
        then: (schema) => schema
            .oneOf([Yup.ref('password')], dict.validation.passwordsMatch)
            .required(dict.validation.confirmPasswordRequired),
        otherwise: (schema) => schema.notRequired(),
    }),
});