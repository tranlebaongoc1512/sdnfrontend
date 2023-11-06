// import React, { useEffect, useState, useContext } from 'react';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import { useParams } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// import './ServiceDetail.css';

// const ServiceDetails = () => {
//   const { token } = useContext(AuthContext);
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [serviceDetails, setServiceDetails] = useState(null);
//   const [isBooked, setIsBooked] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/user', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//         } else {
//           // Handle error response
//           const errorData = await response.json();
//           console.log(errorData.message);
//           navigate('/');
//         }
//       } catch (error) {
//         console.log(error.message);
//         alert('You are not allowed to access here');
//         navigate('/');
//       }
//     };

//     fetchUserProfile();
//   }, [token, navigate]);

//   useEffect(() => {
//     const fetchServiceData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/api/service/${id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setServiceDetails(data);
//         } else {
//           // Handle error response
//           const errorData = await response.json();
//           console.log(errorData.message);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchServiceData();
//   }, [id, token]);

//   useEffect(() => {
//     if (user && serviceDetails) {
//       const fetchBookingData = async () => {
//         try {
//           const response = await fetch('http://localhost:8000/api/booking', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (response.ok) {
//             const bookingData = await response.json();
//             // Check if the user has booked this service
//             const isServiceBooked = bookingData.some(
//               (booking) => booking.serviceId === serviceDetails.id && booking.userId === user.id
//             );
//             setIsBooked(isServiceBooked);
//           } else {
//             // Handle error response
//             const errorData = await response.json();
//             console.log(errorData.message);
//           }
//         } catch (error) {
//           console.log(error.message);
//         }
//       };

//       fetchBookingData();
//     }
//   }, [token, user, serviceDetails]);

//   if (!user || !serviceDetails) {
//     return <div>Loading...</div>;
//   }

//   const { userRole } = user;
//   const isMember = userRole === 'member';

//   const handleBooking = () => {
//     // Check if there are available slots (slotLeft > 0) before booking
//     if (serviceDetails.slotLeft > 0) {
//       const confirmBooking = window.confirm('Are you sure you want to book this service?');
//       if (confirmBooking) {
//         // Send the booking request to the backend
//         const bookingData = {
//           serviceId: serviceDetails.id,
//           teacherId: serviceDetails.teacherId,
//           userId: user.id,
//         };
//         fetch('http://localhost:8000/api/booking/book', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(bookingData),
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error(`HTTP Status: ${response.status}`);
//             }
//             return response.json();
//           })
//           .then((data) => {
//             alert(data.message);
//           })
//           .catch((error) => alert(error.message));
//       }
//     } else {
//       alert('No more slots available!');
//     }
//   };

//   return (
//     <Container sx={{ py: 8 }} maxWidth="xl" serviceName="single">
//       <Grid container spacing={4} serviceName="details-row">
//         <Grid item xs={12} lg={8}>
//           <div serviceName="single-content">
//             <Card>
//               <CardMedia component="img" image={serviceDetails.image} alt="Service" />
//               <CardContent>
//                 <Typography variant="h3" component="h3">
//                   {serviceDetails.name}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </div>
//         </Grid>

//         <Grid item xs={12} lg={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h3" component="h3" serviceName="widget-title">
//                 Service Details:
//               </Typography>
//               <div serviceName="category-widget">
//               <ul>
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Taught By:</strong> {serviceDetails.teacherName}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Service Type:</strong> {serviceDetails.type}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Service Size:</strong> {serviceDetails.serviceSize}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Slots Left:</strong> {serviceDetails.slotLeft > 0 ? serviceDetails.slotLeft : 'Fully Booked'}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>When:</strong> {serviceDetails.date}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>What Time:</strong> {serviceDetails.time}
//                     </Typography>
//                   </li>
//                 </ul>
//               </div>
//               <div serviceName="guest-btns" style={{ margin: '0 auto' }}>
//                 {isMember ? (
//                   <>
//                     {isBooked ? (
//                       <Button variant="contained" disabled>
//                         YOU BOOKED THIS SERVICE
//                       </Button>
//                     ) : (
//                       <>
//                         {serviceDetails.slotLeft > 0 ? (
//                           <Button variant="contained" onClick={handleBooking}>
//                             BOOK SERVICE
//                           </Button>
//                         ) : (
//                           <Button variant="contained" disabled>
//                             NO MORE SLOT
//                           </Button>
//                         )}
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <Typography variant="body2" style={{ float: 'left' }}>
//                     Login as member to book service.
//                   </Typography>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default ServiceDetails;
import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

import './ServiceDetail.css';

const ServiceDetails = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If user is not logged in, set them as guest
          setUser({ userRole: 'guest' });
        }
      } catch (error) {
        console.log(error.message);
        alert('You are not allowed to access here');
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/service/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setServiceDetails(data);
        } else {
          // Handle error response
          const errorData = await response.json();
          console.log(errorData.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchServiceData();
  }, [id, token]);

  useEffect(() => {
    if (user && serviceDetails) {
      const fetchBookingData = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/booking', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const bookingData = await response.json();
            // Check if the user has booked this service
            let isServiceBooked = false;
          if (Array.isArray(bookingData)) {
            for (const booking of bookingData) {
              if (booking.serviceId === serviceDetails.id && booking.userId === user.id) {
                isServiceBooked = true;
                break;
              }
            }
          }
          setIsBooked(isServiceBooked);
          } else {
            // Handle error response
            const errorData = await response.json();
            console.log(errorData.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      };

      fetchBookingData();
    }
  }, [token, user, serviceDetails]);

  const handleBooking = () => {
    // Check if there are available slots (slotLeft > 0) before booking
    if (serviceDetails.slotLeft > 0) {
      const confirmBooking = window.confirm('Are you sure you want to book this service?');
      if (confirmBooking) {
        // Send the booking request to the backend
        const bookingData = {
          serviceId: serviceDetails.id,
          teacherId: serviceDetails.teacherId,
          userId: user.id,
        };
        fetch('http://localhost:8000/api/booking/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            alert(data.message);
            setIsBooked(true); // Update isBooked state to true after successful booking
          })
          .catch((error) => alert(error.message));
      }
    } else {
      alert('No more slots available!');
    }
  };

  if (!user || !serviceDetails) {
    return <div>Loading...</div>;
  }

  const { role } = user;
  const isMember = role === 'member';

  const img = {
    src: 'https://images.squarespace-cdn.com/content/v1/559d822ae4b0b0ab59484d42/1444777151238-AU8MXVDVG9JPWYTDZ36H/image-asset.jpeg'
  }

  return (
    <>
    <Navigation/>
    <Container sx={{ py: 8 }} maxWidth="xl" serviceName="single">
      <Grid container spacing={4} serviceName="details-row">
        <Grid item xs={12} lg={7}>
          <div serviceName="single-content">
            <Card style={{alignItems:'center', justifyItems: 'center'}}>
              <CardMedia component="img" style={{width: '500px', height: '500px'}} 
              // image={serviceDetails.image} 
              src={img.src}
              alt="Service" />
              <CardContent>
                <Typography variant="h3" component="h3">
                  {serviceDetails.name}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="h3" serviceName="widget-title">
                Service Details:
              </Typography>
              <div serviceName="category-widget">
                <ul>
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Provider:</strong> {serviceDetails.teacherName}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Service category:</strong> {serviceDetails.type}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Description:</strong> {serviceDetails.serviceSize}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Price:</strong> {serviceDetails.serviceSize}
                    </Typography>
                  </li>
                  {/* <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Slots Left:</strong>{' '}
                      {serviceDetails.slotLeft > 0 ? serviceDetails.slotLeft : 'Fully Booked'}
                    </Typography>
                  </li> */}
                  {/* <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>When:</strong> {serviceDetails.date}
                    </Typography>
                  </li> */}
                  {/* <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>What Time:</strong> {serviceDetails.time}
                    </Typography>
                  </li> */}
                </ul>
              </div>
              <div serviceName="guest-btns" style={{ margin: '0 auto' }}>
                {isMember ? (
                  <>
                    {isBooked ? (
                      <Button variant="contained" disabled>
                        YOU BOOKED THIS SERVICE
                      </Button>
                    ) : (
                      <>
                        {serviceDetails.slotLeft > 0 ? (
                          <Button variant="contained" onClick={handleBooking}>
                            BOOK SERVICE
                          </Button>
                        ) : (
                          <Button variant="contained" disabled>
                            NO MORE SLOT
                          </Button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" style={{ float: 'left' }}>
                    Login as member to book service.
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    <Footer/>
    </>
  );
};

export default ServiceDetails;
