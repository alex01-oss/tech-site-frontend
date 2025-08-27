import React, {memo} from "react";
import {Box, Tooltip, Typography} from "@mui/material";

interface Props {
    label: string;
    value: React.ReactNode;
    tooltip?: string;
}

export const ProductDetailRow: React.FC<Props> = memo(({ label, value, tooltip }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Typography
                variant="caption"
                sx={{
                    minWidth: { xs: 65, sm: 75 },
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}
            >
                {label}
            </Typography>

            {tooltip ? (
                <Tooltip title={tooltip} placement="top">
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 'medium',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flexGrow: 1,
                        }}
                    >
                        {value}
                    </Typography>
                </Tooltip>
            ) : (
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.primary',
                        fontWeight: 'medium',
                    }}
                >
                    {value}
                </Typography>
            )}
        </Box>
    );
});