import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

export default function Service() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const baseURL = 'http://localhost:8000/api/service/list';

    fetch(baseURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setServices(data.services);
      })
      .catch(error => console.log(error.message));
  }, []);

  return (
    <>
    <Navigation/>
    <Container sx={{ py: 8, mt: 1 }} maxWidth="xl" serviceName="content" style={{ marginBottom: '120px' }}>
      <Typography variant="h4" component="div" sx={{mb: 3}}>
        Services
      </Typography>

      <Card
  
/>

      <Grid container spacing={4}>
        {services.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4} xl={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                }}
                image={card.image}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {card.providerId.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.categoryId.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.price}
                </Typography>
              </CardContent>

              <CardActions style={{ margin: '0 auto' }}>
                <Link to={`${card._id}`}>
                  <Button serviceName="btn">Service Detail</Button>
                </Link>
              </CardActions>

            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    <Footer/>
    </>
  );
}
