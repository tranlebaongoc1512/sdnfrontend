import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import React from 'react';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

export default function Home() {
  return (
    <>
    <Navigation />
    <Container className="container" maxWidth="xl" style={{padding: '10px', marginBottom: '160px'}}>
        <Card className="film-tile">
          <CardMedia
            component="img"
            src={`../assets/yoga.png`}
            alt={'yoga'}
            style={{ width: '60%', margin: '0 auto' }}
          />
        </Card>
        <CardContent>
            <Typography variant="h4" component="div">
              Yoga for life
            </Typography>
          </CardContent>
    </Container>
    <Footer/>
    </>
  );
}

