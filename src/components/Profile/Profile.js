import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './profile.module.css'
import {
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Backdrop,
  Modal,
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AccountManagement from '../AccountManagement/AccountManagement';
import ServiceManagement from '../ServiceManagement/ServiceManagement';
import ProviderServiceManagement from '../ProviderServiceManagement/ProviderServiceManagement';
import FooterComponent from '../Footer/Footer';
import Navigation from '../Navigation/Navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(1);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isFetchUserData, setIsFetchUserData] = useState(false)


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
        setIsFetchUserData(true)
      } else {
        // Handle error response
        const errorData = await response.json();
        console.log(errorData.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: 'You are not allowed to access here',
      });
      navigate('/');
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, [token]);
  useEffect(() => {
    if (isFetchUserData) {
      formik.setValues({
        fullName: user.fullName,
        image: user.image
      });
    }
  }, [isFetchUserData]);
  const formik = useFormik({
    initialValues: {
      fullName: '',
      image: ''
    },
    onSubmit: async (values) => {
      try {
        console.log(token);
        const response = await fetch(`http://localhost:8000/api/user/update`, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          Swal.fire({
            title: "User info updated successfully",
            icon: "success"
          });
          fetchUserProfile()
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: errorData.message,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required.'),
      image: Yup.string().required('Required.').url('Invalid URL format'),
    }),
  });
  const formikPassword = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: async (values) => {
      try {
        console.log(token);
        const response = await fetch(`http://localhost:8000/api/user/changePassword`, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          Swal.fire({
            title: "Password updated successfully",
            icon: "success"
          });
          formikPassword.resetForm()
          setOpen(false)
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: errorData.message,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: error.message,
        });
      }
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Required.'),
      newPassword: Yup.string().required('Required.').min(6, 'Password must be at least 6 characters long.'),
      confirmNewPassword: Yup.string().required('Required.').min(6, 'Password must be at least 6 characters long.'),
    }),
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const { fullName, image, role, email } = user;


  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.background}>
          <img className={styles.avatar} alt="Avatar" src={image} />
          <div className={styles.info}>
            <Typography variant="h3" component="h3">
              {fullName}
            </Typography>
            <Typography variant="body1">{role}</Typography>
            <Typography variant="body1">{email}</Typography>
          </div>
        </div>
        {role === 'admin' && (
          <Box sx={{ display: 'flex', height: '100% !important' }}>
            <Tabs
              variant="scrollable"
              orientation='vertical'
              value={value}
              onChange={(event, value) => setValue(value)}
              className={styles.tabsMenu}
            >
              <Tab label="GENERAL" disabled className={styles.tabsLable}>General</Tab>
              <Tab label="Profile" className={value === 1 ? styles.outlined : styles.plain}>Profile</Tab>
              <Tab label="Account Management" className={value === 2 ? styles.outlined : styles.plain}>Account Management</Tab>
              <Tab label="Service Management" className={value === 3 ? styles.outlined : styles.plain}>Service Management</Tab>
            </Tabs>
            <div>
              {value === 1 && <div className={styles.tabContent}>
                {/* <img src='./assets/img/empty.png' alt='empty' /> */}
                <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Change user info</Typography>
                <TextField
                  id="fullName"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && formik.errors.fullName}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
                <TextField
                  id="image"
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  name="image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                  error={formik.touched.image && formik.errors.image}
                  helperText={formik.touched.image && formik.errors.image}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                  <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Save</Button>
                  <Button sx={{ marginRight: '10px' }} variant="contained" onClick={() => setOpen(true)} color="primary">Change Password</Button>
                </div>
              </div>}
              {value === 2 &&
                <div className={styles.tabContent}>
                  <AccountManagement />
                </div>}
              {value === 3 && <div className={styles.tabContent}>
                <ServiceManagement />
              </div>}
            </div>
          </Box>
        )}
        {role === 'provider' && (
          <Box sx={{ display: 'flex', height: '100% !important' }}>
            <Tabs
              variant="scrollable"
              orientation='vertical'
              value={value}
              onChange={(event, value) => setValue(value)}
              className={styles.tabsMenu}
            >
              <Tab label="GENERAL" disabled className={styles.tabsLable}>General</Tab>
              <Tab label="Profile" className={value === 1 ? styles.outlined : styles.plain}>Profile</Tab>
              <Tab label="Service Management" className={value === 2 ? styles.outlined : styles.plain}>Service Management</Tab>
            </Tabs>
            <div>
              {value === 1 && <div className={styles.tabContent}>
                <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px', marginTop:'20px'}}>Change user info</Typography>
                <TextField
                  
                  id="fullName"
                  label="Full Name"
                  fullWidth
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && formik.errors.fullName}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
                <TextField
                  id="image"
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  name="image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                  error={formik.touched.image && formik.errors.image}
                  helperText={formik.touched.image && formik.errors.image}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                  <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Save</Button>
                  <Button sx={{ marginRight: '10px' }} variant="contained" onClick={() => setOpen(true)} color="primary">Change Password</Button>
                </div>
              </div>}
              {value === 2 && <div className={styles.tabContent}>
                <ProviderServiceManagement />
              </div>}
            </div>
          </Box>
        )}
        {role === 'customer' && (
          <div>
            <Box sx={{ display: 'flex', height: '100% !important' }}>
              <Tabs
                variant="scrollable"
                orientation='vertical'
                value={value}
                onChange={(event, value) => setValue(value)}
                className={styles.tabsMenu}
              >
                <Tab label="GENERAL" disabled className={styles.tabsLable}>General</Tab>
                <Tab label="Profile" className={value === 1 ? styles.outlined : styles.plain}>Profile</Tab>
              </Tabs>
              <div>
                {value === 1 && <div className={styles.tabContent}>
                  <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Change user info</Typography>
                  <TextField
                    id="fullName"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    error={formik.touched.fullName && formik.errors.fullName}
                    helperText={formik.touched.fullName && formik.errors.fullName}
                  />
                  <TextField
                    id="image"
                    label="Image URL"
                    fullWidth
                    margin="normal"
                    name="image"
                    value={formik.values.image}
                    onChange={formik.handleChange}
                    error={formik.touched.image && formik.errors.image}
                    helperText={formik.touched.image && formik.errors.image}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                    <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Save</Button>
                    <Button sx={{ marginRight: '10px' }} variant="contained" onClick={() => setOpen(true)} color="primary">Change Password</Button>
                  </div>
                </div>}
              </div>
            </Box>
          </div>
        )}
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
              <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Change password</Typography>
              <TextField
                id="oldPassword"
                label="Old password"
                fullWidth
                margin="normal"
                type='password'
                name="oldPassword"
                value={formikPassword.values.oldPassword}
                onChange={formikPassword.handleChange}
                error={formikPassword.touched.oldPassword && formikPassword.errors.oldPassword}
                helperText={formikPassword.touched.oldPassword && formikPassword.errors.oldPassword}
              />
              <TextField
                id="newPassword"
                label="New password"
                fullWidth
                margin="normal"
                type='password'
                name="newPassword"
                value={formikPassword.values.newPassword}
                onChange={formikPassword.handleChange}
                error={formikPassword.touched.newPassword && formikPassword.errors.newPassword}
                helperText={formikPassword.touched.newPassword && formikPassword.errors.newPassword}
              />
              <TextField
                id="confirmNewPassword"
                label="Confirm new password"
                fullWidth
                margin="normal"
                name="confirmNewPassword"
                type='password'
                value={formikPassword.values.confirmNewPassword}
                onChange={formikPassword.handleChange}
                error={formikPassword.touched.confirmNewPassword && formikPassword.errors.confirmNewPassword}
                helperText={formikPassword.touched.confirmNewPassword && formikPassword.errors.confirmNewPassword}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formikPassword.handleSubmit} color="primary">Submit</Button>
                <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </Box>
          </Fade>
        </Modal>
      </div>
      <FooterComponent />
    </>
  );
};

export default Profile;
