import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './profile.module.css'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AccountManagement from '../accountManagement/AccountManagement';
import ServiceManagement from '../serviceManagement/ServiceManagement';
import ProviderServiceManagement from '../providerServiceManagement/ProviderServiceManagement';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [providerData, setProviderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [value, setValue] = useState(1);
  const navigate = useNavigate();

  const fetchProviderData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/provider', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProviderData(data);
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/booking/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setCustomerData(data);
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

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

          // Check the role and fetch additional data accordingly
          if (userData.role === 'provider') {
            fetchProviderData();
          } else if (userData.role === 'customer') {
            fetchCustomerData();
          }
        } else {
          // Handle error response
          const errorData = await response.json();
          console.log(errorData.message);
          navigate('/');
        }
      } catch (error) {
        console.log(error.message);
        alert('You are not allowed to access here');
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
        <Box sx={{ display: 'flex', height: '100% !import' }}>
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
      {role === 'provider' && providerData && (
        <Box sx={{ display: 'flex', height: '100% !import' }}>
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
            {value === 3 && <div className={styles.tabContent}>
              <ProviderServiceManagement />
            </div>}
          </div>
        </Box>
      )}
      {role === 'customer' && customerData && (
        <div>
          <Box sx={{ display: 'flex', height: '100% !import' }}>
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
  );
};

export default Profile;
