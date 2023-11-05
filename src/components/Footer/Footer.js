import React from 'react';
import './Footer.css'
import { Container, Typography, Grid} from '@mui/material';

export default function FooterComponent() {

  return (
    <footer>
      <Container>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h2" color="white">
              Opening Hours
            </Typography>
            <Typography variant="body2" color="white" mt={2}>
                monday : <i> 7:00am - 10:30pm </i> 
            </Typography>
            <Typography variant="body2" color="white" mt={2}>tuesday : <i> 7:00am - 10:30pm </i></Typography>
            <Typography variant="body2" color="white" mt={2}>wednesday : <i> 7:00am - 10:30pm </i> </Typography>
            <Typography variant="body2" color="white" mt={2}>thursday : <i> 7:00am - 10:30pm </i> </Typography>
            <Typography variant="body2" color="white" mt={2}>friday : <i> 7:00am - 10:30pm </i> </Typography>
            <Typography variant="body2" color="white" mt={2}>saturday : <i> 7:00am - 10:30pm </i> </Typography>
            <Typography variant="body2" color="white" mt={2}>sunday : <i> closed </i> </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h2" color="white">
              Contact us
            </Typography>
            <Typography variant="body2" color="white" mt={2}>+123-456-7890</Typography>
            <Typography variant="body2" color="white" mt={2}>Ho Chi Minh City</Typography>
            <Typography variant="body2" color="white" mt={2}>fityoga@gmail.com</Typography>
          </Grid>
        </Grid>
      </Container>
      <Typography variant="body2" color="white" align="center" mt={2}>
        © 2023 Copyright Text
      </Typography>
    </footer>
  );
}
