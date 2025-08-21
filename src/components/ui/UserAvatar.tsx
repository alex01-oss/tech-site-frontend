import React from 'react';
import { Avatar, useTheme } from '@mui/material';
import {User} from "@/features/auth/types";

interface UserAvatarProps {
    user: User | null;
    isAuthenticated: boolean;
    size: 'small' | 'large';
    onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, isAuthenticated, size, onClick }) => {
    const theme = useTheme();

    const getInitials = (fullName: string | undefined): string => {
        if (!fullName || fullName.trim().length === 0) {
            return '';
        }
        const words = fullName.split(' ').filter(Boolean).slice(0, 2);
        return words.map((word: string) => word[0]?.toUpperCase()).join('');
    };

    const avatarSx = {
        cursor: onClick ? 'pointer' : 'default',
        ...(size === 'small' && {
            width: theme.spacing(5),
            height: theme.spacing(5),
            ml: 1,
            fontSize: theme.spacing(2),
        }),
        ...(size === 'large' && {
            width: theme.spacing(12),
            height: theme.spacing(12),
            fontSize: theme.spacing(6),
        }),
    };

    return (
        <Avatar onClick={onClick} sx={avatarSx}>
            {isAuthenticated && user?.full_name ? getInitials(user.full_name) : ''}
        </Avatar>
    );
};