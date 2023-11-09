import React from 'react';
import './Footer.css'
import { Container, Typography, Grid, Box} from '@mui/material';
import Link from "@mui/material/Link";

export default function FooterComponent() {

  return (
    <footer>
      <Box
      style={{ backgroundColor: '#6dabb4' }}
      sx={{
  
        pt: 6, pb: 2
      }}
      component="footer"
    >
      <Container maxWidth="sm" >
        <Typography variant="body2" color="text.secondary" align="center"style={{ color: 'white' }}>
          Copyright © 
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
    </footer>
  );
}
