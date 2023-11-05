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

// import './ClassDetail.css';

// const ClassDetails = () => {
//   const { token } = useContext(AuthContext);
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [classDetails, setClassDetails] = useState(null);
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
//     const fetchClassData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/api/class/${id}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setClassDetails(data);
//         } else {
//           // Handle error response
//           const errorData = await response.json();
//           console.log(errorData.message);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchClassData();
//   }, [id, token]);

//   useEffect(() => {
//     if (user && classDetails) {
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
//             // Check if the user has booked this class
//             const isClassBooked = bookingData.some(
//               (booking) => booking.classId === classDetails.id && booking.userId === user.id
//             );
//             setIsBooked(isClassBooked);
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
//   }, [token, user, classDetails]);

//   if (!user || !classDetails) {
//     return <div>Loading...</div>;
//   }

//   const { userRole } = user;
//   const isMember = userRole === 'member';

//   const handleBooking = () => {
//     // Check if there are available slots (slotLeft > 0) before booking
//     if (classDetails.slotLeft > 0) {
//       const confirmBooking = window.confirm('Are you sure you want to book this class?');
//       if (confirmBooking) {
//         // Send the booking request to the backend
//         const bookingData = {
//           classId: classDetails.id,
//           teacherId: classDetails.teacherId,
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
//     <Container sx={{ py: 8 }} maxWidth="xl" className="single">
//       <Grid container spacing={4} className="details-row">
//         <Grid item xs={12} lg={8}>
//           <div className="single-content">
//             <Card>
//               <CardMedia component="img" image={classDetails.image} alt="Class" />
//               <CardContent>
//                 <Typography variant="h3" component="h3">
//                   {classDetails.name}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </div>
//         </Grid>

//         <Grid item xs={12} lg={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h3" component="h3" className="widget-title">
//                 Class Details:
//               </Typography>
//               <div className="category-widget">
//               <ul>
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Taught By:</strong> {classDetails.teacherName}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Class Type:</strong> {classDetails.type}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Class Size:</strong> {classDetails.classSize}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>Slots Left:</strong> {classDetails.slotLeft > 0 ? classDetails.slotLeft : 'Fully Booked'}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>When:</strong> {classDetails.date}
//                     </Typography>
//                   </li>
//                   <br />
//                   <li>
//                     <Typography variant="body2" style={{ float: 'left' }}>
//                       <strong>What Time:</strong> {classDetails.time}
//                     </Typography>
//                   </li>
//                 </ul>
//               </div>
//               <div className="guest-btns" style={{ margin: '0 auto' }}>
//                 {isMember ? (
//                   <>
//                     {isBooked ? (
//                       <Button variant="contained" disabled>
//                         YOU BOOKED THIS CLASS
//                       </Button>
//                     ) : (
//                       <>
//                         {classDetails.slotLeft > 0 ? (
//                           <Button variant="contained" onClick={handleBooking}>
//                             BOOK CLASS
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
//                     Login as member to book class.
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

// export default ClassDetails;
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

import './ClassDetail.css';

const ClassDetails = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
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
    const fetchClassData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/class/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClassDetails(data);
        } else {
          // Handle error response
          const errorData = await response.json();
          console.log(errorData.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchClassData();
  }, [id, token]);

  useEffect(() => {
    if (user && classDetails) {
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
            // Check if the user has booked this class
            let isClassBooked = false;
          if (Array.isArray(bookingData)) {
            for (const booking of bookingData) {
              if (booking.classId === classDetails.id && booking.userId === user.id) {
                isClassBooked = true;
                break;
              }
            }
          }
          setIsBooked(isClassBooked);
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
  }, [token, user, classDetails]);

  const handleBooking = () => {
    // Check if there are available slots (slotLeft > 0) before booking
    if (classDetails.slotLeft > 0) {
      const confirmBooking = window.confirm('Are you sure you want to book this class?');
      if (confirmBooking) {
        // Send the booking request to the backend
        const bookingData = {
          classId: classDetails.id,
          teacherId: classDetails.teacherId,
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

  if (!user || !classDetails) {
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
    <Container sx={{ py: 8 }} maxWidth="xl" className="single">
      <Grid container spacing={4} className="details-row">
        <Grid item xs={12} lg={7}>
          <div className="single-content">
            <Card style={{alignItems:'center', justifyItems: 'center'}}>
              <CardMedia component="img" style={{width: '500px', height: '500px'}} 
              // image={classDetails.image} 
              src={img.src}
              alt="Class" />
              <CardContent>
                <Typography variant="h3" component="h3">
                  {classDetails.name}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="h3" className="widget-title">
                Service Details:
              </Typography>
              <div className="category-widget">
                <ul>
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Provider:</strong> {classDetails.teacherName}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Service category:</strong> {classDetails.type}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Description:</strong> {classDetails.classSize}
                    </Typography>
                  </li>
                  <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Price:</strong> {classDetails.classSize}
                    </Typography>
                  </li>
                  {/* <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>Slots Left:</strong>{' '}
                      {classDetails.slotLeft > 0 ? classDetails.slotLeft : 'Fully Booked'}
                    </Typography>
                  </li> */}
                  {/* <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>When:</strong> {classDetails.date}
                    </Typography>
                  </li> */}
                  {/* <br />
                  <li>
                    <Typography variant="body2" style={{ float: 'left' }}>
                      <strong>What Time:</strong> {classDetails.time}
                    </Typography>
                  </li> */}
                </ul>
              </div>
              <div className="guest-btns" style={{ margin: '0 auto' }}>
                {isMember ? (
                  <>
                    {isBooked ? (
                      <Button variant="contained" disabled>
                        YOU BOOKED THIS CLASS
                      </Button>
                    ) : (
                      <>
                        {classDetails.slotLeft > 0 ? (
                          <Button variant="contained" onClick={handleBooking}>
                            BOOK CLASS
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
                    Login as member to book class.
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

export default ClassDetails;
