'use client';

import React, { useState } from 'react';
import { FormControl, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, ErrorMessage } from 'formik';
import {useDictionary} from "@/providers/DictionaryProvider";
import { FormikFieldProps } from '@/types/formik';

interface PasswordFieldProps {
    name: string;
    label: string;
    required?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    name,
    label,
    required = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const dict = useDictionary();
    const inputId = `${name}-input`;

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
    <Field name={name}>
      {({ field, meta }: FormikFieldProps) => (
        <FormControl fullWidth margin="normal">
          <TextField
            {...field}
            label={label}
            type={showPassword ? 'text' : 'password'}
            id={inputId}
            required={required}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label={
                      showPassword
                        ? dict.auth.password.hide
                        : dict.auth.password.show
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      )}
    </Field>
  );
};