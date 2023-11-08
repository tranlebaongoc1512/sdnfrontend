import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import React from 'react';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
// import Carousel from 'react-material-ui-carousel'
// import { Paper, Button } from '@mui/material'

export default function Home() {

  
  return (
    <>
    <Navigation />
    <Container className="container" maxWidth="xl" style={{padding: '10px', marginBottom: '160px'}}>
    <div style={{display:"flex", flexDirection:"column"}}>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr", backgroundColor:"green", height:"300px"}}>
      <div style={{display:"flex",alignItems:"center", justifyContent:"center", flexDirection:"column"}}> <div>Header</div>
      <div>Header 2</div>
      <div>Detail</div>
</div>
<div>HInhg</div>
     
    </div>
    <img src="https://cdn.animaapp.com/projects/6543ac513678c9141fbb9a38/releases/654bf6a3a8c5bd963a266510/img/frame-1.png"/>
    </div>
    </Container>

    <Footer/>
    </>
  );
}

