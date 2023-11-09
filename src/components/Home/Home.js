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
    <div style={{display:"grid",gridTemplateColumns:"2fr 2fr", backgroundColor:"#6DABB4", height:"700px"}}>
      <div style={{display:"flex",
      alignItems:"center", justifyContent:"center",     
      flexDirection:"column"}}> 
      <div style={{marginBottom:'10px' ,fontSize:'50px', fontWeight:'750', color:'white'}}>
      Birds are always friends,</div>
      <div style={{marginBottom:'50px', fontSize:'30px', fontWeight:'750', color:'#89CED8'}}
      >Dedication is always a priority</div>
      <div style={{color:'white'}}
      >Boundless love for animals.
            <br/>
            Dedicated service.
            <br/>
            Customers feel secure. </div>
</div>
<div style={{marginTop:'80px'}}>
  <img 
  style={{width:'450px', height:'600px'}}
  // src='../public/assets/img/Multicolored_Bird_PNG_Clipart-501.png'/>
  src='https://pics.clipartpng.com/Bird_PNG_Clip_Art-1566.png'/>
</div>
     
    </div>
    <img src="https://cdn.animaapp.com/projects/6543ac513678c9141fbb9a38/releases/654bf915a58c25517864f48e/img/frame-1.png"/>
    </div>
    </Container>

    <Footer/>
    </>
  );
}

