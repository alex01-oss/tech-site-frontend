'use client';

import React, { useState } from 'react';
import { FormControl, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, ErrorMessage } from 'formik';

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
                required={required}
                helperText={<ErrorMessage name={name} />}
                slotProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
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