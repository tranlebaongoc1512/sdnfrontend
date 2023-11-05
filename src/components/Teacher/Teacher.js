import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

export default function Teacher() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const baseURL = 'http://localhost:8000/api/teacher';

    fetch(baseURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTeachers(data);
      })
      .catch(error => console.log(error.message));
  }, []);

  return (
    <>
    <Navigation/>
    <Container sx={{ py: 8}} maxWidth="xl" className='content' style={{marginBottom: '120px'}}>
      <Typography variant="h4" component="div">
            Teachers
      </Typography>  
      <Grid container spacing={4}>
        {teachers.map((card) => (
          <Grid item key={card} xs={12} sm={6} md={4} xl={3}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                }}
                image={`../${card.image}`}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.fullName}
                </Typography>
                <Typography>
                  {card.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    <Footer/>
</>
  );
}
