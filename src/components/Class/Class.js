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
import Box from '@mui/material/Box';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

export default function Class() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const baseURL = 'http://localhost:8000/api/class';

    fetch(baseURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setClasses(data);
      })
      .catch(error => console.log(error.message));
  }, []);

  return (
    <>
    <Navigation/>
    <Container sx={{ py: 8, mt: 1 }} maxWidth="xl" className="content" style={{ marginBottom: '120px' }}>
      <Typography variant="h4" component="div" sx={{mb: 3}}>
        Services
      </Typography>

      <Card
  
/>

      <Grid container spacing={4}>
        {classes.map((card) => (
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
                  <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                  {card.time}

                  <DateRangeIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 2, mr: 1 }} />
                  {card.date}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex' }}>
                    <PersonIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                    {card.slotLeft} / {card.classSize}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Type: {card.type}
                </Typography>
              </CardContent>

              <CardActions style={{ margin: '0 auto' }}>
                <Link to={`${card.id}`}>
                  <Button className="btn">Service Detail</Button>
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
