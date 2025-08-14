import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

const AboutUsSection: React.FC = () => {
    return (
        <Paper elevation={3} sx={{p: 3, bgcolor: 'background.paper', borderRadius: 1}}>
            <Typography variant="h4" component="h2" sx={{mb: {xs: 1, sm: 2}, color: 'primary.main', textAlign: 'center'}}>
                About us
            </Typography>
            <Typography variant="body1" sx={{color: 'text.secondary', lineHeight: 1.8}}>
                Since 1966, PJSC «Poltava Diamond Tool» has continued the tradition of quality and
                innovation in the production of diamond and CBN tools. Our company has evolved from
                developing the first diamond powders in the USSR to a modern enterprise providing
                complex industrial solutions worldwide. We pride ourselves on our rich history and
                commitment to excellence, delivering cutting-edge abrasive solutions for various industries.
            </Typography>
        </Paper>
    );
};

export default AboutUsSection;