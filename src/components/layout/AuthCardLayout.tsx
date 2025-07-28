import {
    Card,
    FormControl,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import React from 'react';
import {ErrorMessage, Field} from 'formik';
import {useRouter} from "next/navigation";

interface AuthCardLayoutProps {
    title: string,
    children: React.ReactNode,
    isLogin?: boolean,
    loading?: boolean
}

export const PasswordField: React.FC<{
    name: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<any>) => void,
    onBlur: (e: React.FocusEvent<any>) => void,
    required?: boolean,
    showPassword: boolean,
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
      showPassword,
      setShowPassword,
      name,
      label,
      value,
      onChange,
      onBlur,
      required = false
  }) => {
    return (
        <FormControl fullWidth margin="normal">
            <Field
                as={TextField}
                label={label}
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                helperText={<ErrorMessage name={name}/>}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </FormControl>
    );
};


const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
    title,
    children,
    isLogin = false,
}) => {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Stack height="100vh" p={2} justifyContent="center">
            <Card
                variant="outlined"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    width: '100%',
                    maxWidth: 450,
                    p: 4,
                    gap: 2,
                    m: "auto",
                    boxShadow: theme.shadows[3],
                }}
            >
                <Typography variant="h4" textAlign="center" fontWeight={600} mb={2}>
                    {title}
                </Typography>
                {children}
                <Typography textAlign="center" mt={2}>
                    {isLogin ? (
                        <>
                            Don't have an account?{" "}
                            <Link component="button" onClick={() => router.push("/registration")}
                                  sx={{cursor: 'pointer'}}>
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link component="button" onClick={() => router.push("/login")} sx={{cursor: 'pointer'}}>
                                Sign in
                            </Link>
                        </>
                    )}
                </Typography>
            </Card>
        </Stack>
    );
};

export default AuthCardLayout;