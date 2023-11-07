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
import { useFormik } from 'formik';
import * as Yup from 'yup';

import './ServiceDetail.css';
import Swal from 'sweetalert2';
import { Backdrop, Box, Fade, Modal, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

const ServiceDetails = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  const fetchServiceData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/service/detail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setServiceDetails(data.service);
        setIsLoading(false)
      } else {
        // Handle error response
        const errorData = await response.json();
        console.log(errorData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
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
        const data = await response.json();
        setUser(data);
      } else {
        // If user is not logged in, set them as guest
        setUser({ role: 'guest' });
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: 'You are not allowed to access here',
      }).then(
        navigate('/'))
    }
  };

  useEffect(() => {
    fetchUserProfile()
    fetchServiceData();
  }, []);
  useEffect(() => {
    if (user?.role === 'customer' && id) {
      formik.setValues({
        serviceId: id,
        customerId: user._id
      });
    }
  }, [user, id]);

  const formik = useFormik({
    initialValues: {
      serviceId: '',
      customerId: '',
      datetime: dayjs(new Date()),
      address: '',
    },
    onSubmit: async (values) => {
      console.log(values)
      try {
        // const response = await fetch('http://localhost:8000/api/booking/add', {
        //   method: 'POST',
        //   body: JSON.stringify(values),
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // if (response.ok) {
        //   Swal.fire({
        //     title: "Booked successfully",
        //     icon: "success"
        //   });
        //   formik.resetForm();
        //   setOpen(false);
        // } else {
        //   const errorData = await response.json();
        //   Swal.fire({
        //     icon: "error",
        //     title: errorData.message,
        //   });
        // }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    },
    validationSchema: Yup.object({
      address: Yup.string().required('Required.'),
    }),
  });

  if (isLoading === true) return (
    <div>Loading...</div>
  )
  return (
    <>
      <Navigation />
      <Container sx={{ py: 8 }} maxWidth="xl" className="single">
        <Grid container spacing={4} className="details-row">
          <Grid item xs={12} lg={7}>
            <div className="single-content">
              <Card style={{ alignItems: 'center', justifyItems: 'center' }}>
                <CardMedia component="img" style={{ width: '500px', height: '500px' }}
                  src={serviceDetails.image}
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
                <Typography variant="h3" component="h3" className="widget-title">
                  Service Details:
                </Typography>
                <div className="category-widget">
                  <ul>
                    <li>
                      <Typography variant="body2" style={{ float: 'left' }}>
                        <strong>Provider:</strong> {serviceDetails.providerId.fullName}
                      </Typography>
                    </li>
                    <br />
                    <li>
                      <Typography variant="body2" style={{ float: 'left' }}>
                        <strong>Service category:</strong> {serviceDetails.categoryId.name}
                      </Typography>
                    </li>
                    <br />
                    <li>
                      <Typography variant="body2" style={{ float: 'left' }}>
                        <strong>Description:</strong> {serviceDetails.description}
                      </Typography>
                    </li>
                    <br />
                    <li>
                      <Typography variant="body2" style={{ float: 'left' }}>
                        <strong>Price:</strong> {serviceDetails.price}
                      </Typography>
                    </li>
                  </ul>
                </div>
                <div className="guest-btns" style={{ margin: '0 auto' }}>
                  {user.role === 'customer' ? (
                    <>
                      <Button variant="contained" onClick={() => { setOpen(true) }} >
                        Book
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" style={{ float: 'left' }}>
                      Login as customer to book service.
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={() => setOpen(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: '10px 10px 5px rgba(0, 0, 0, 50%)',
              borderRadius: '10px',
              p: 4,
            }}>
              <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Add Booking Information</Typography>
              <TextField
                id="address"
                label="Address"
                fullWidth
                margin="normal"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && formik.errors.address}
                helperText={formik.touched.address && formik.errors.address}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    label="Datetime picker"
                    name='datetime'
                    value={dayjs(formik.values.datetime)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Submit</Button>
                <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </Box>
          </Fade>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default ServiceDetails;
