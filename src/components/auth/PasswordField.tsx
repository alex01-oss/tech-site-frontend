'use client';

import React, { useState } from 'react';
import { FormControl, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, ErrorMessage } from 'formik';
import {PasswordFieldDict} from "@/types/dict";

interface PasswordFieldProps {
    name: string;
    label: string;
    required?: boolean;
    dict: PasswordFieldDict
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    name,
    label,
    required = false,
    dict
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = `${name}-input`;

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl fullWidth margin="normal">
            <Field
                as={TextField}
                label={label}
                type={showPassword ? 'text' : 'password'}
                name={name}
                id={inputId}
                required={required}
                helperText={<ErrorMessage name={name} />}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                aria-label={
                                    showPassword
                                        ? dict.hidePassword
                                        : dict.showPassword
                                }
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </FormControl>
    );
};