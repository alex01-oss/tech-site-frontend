import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Props {
    dict: {
        title: string,
        content: string,
    }
}

const AboutUsSection: React.FC<Props> = ({ dict }) => {
    return (
        <Paper elevation={3} sx={{p: 3, bgcolor: 'background.paper', borderRadius: 1}}>
            <Typography variant="h4" component="h2" sx={{mb: {xs: 1, sm: 2}, color: 'primary.main', textAlign: 'center'}}>
                {dict.title}
            </Typography>
            <Typography variant="body1" sx={{color: 'text.secondary', textAlign: 'justify', lineHeight: 1.8}}>
                {dict.content}
            </Typography>
        </Paper>
    );
};

export default AboutUsSection;