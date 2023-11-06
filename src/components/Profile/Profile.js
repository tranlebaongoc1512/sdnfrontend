import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './profile.module.css'
import {
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AccountManagement from '../AccountManagement/AccountManagement';
import ServiceManagement from '../ServiceManagement/ServiceManagement';
import ProviderServiceManagement from '../ProviderServiceManagement/ProviderServiceManagement';
import FooterComponent from '../Footer/Footer';
import Navigation from '../Navigation/Navigation';
import Swal from 'sweetalert2';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(1);
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

    fetchUserProfile();
  }, [token]);

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
                <img src='./assets/img/empty.png' alt='empty' />
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
                <img src='./assets/img/empty.png' alt='empty' />
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
                  <img src='./assets/img/empty.png' alt='empty' />
                </div>}
              </div>
            </Box>
          </div>
        )}
      </div>
      <FooterComponent />
    </>
  );
};

export default Profile;
