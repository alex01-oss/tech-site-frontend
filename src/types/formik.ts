import { FieldInputProps, FieldMetaProps } from "formik";

export interface FormikFieldProps {
  field: FieldInputProps<string>;
  meta: FieldMetaProps<string>;
}

export interface FormikCheckboxFieldProps {
  field: FieldInputProps<boolean>;
  meta: FieldMetaProps<boolean>;
}