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
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import ClassManagement from '../ClassManagement/ClassManagement';
import TeacherManagement from '../TeacherManagement/TeacherManagement';
import MembershipManagement from '../MembershipManagement.js/MembershipManagement';
import BookingManagement from '../BookingManagement/BookingManagement';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [value, setValue] = useState(1);
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teacher/class', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTeacherData(data);
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchMemberData = async () => {
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
        setMemberData(data);
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
          if (userData.role === 'teacher') {
            fetchTeacherData();
          } else if (userData.role === 'member') {
            fetchMemberData();
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
            <Tab label="Class Management" className={value === 2 ? styles.outlined : styles.plain}>Class Management</Tab>
            <Tab label="Teacher Management" className={value === 3 ? styles.outlined : styles.plain}>Teacher Management</Tab>
            <Tab label="Membership Management" className={value === 4 ? styles.outlined : styles.plain}>Membership Management</Tab>
            <Tab label="Booking Management" className={value === 5 ? styles.outlined : styles.plain}>Booking Management</Tab>
          </Tabs>
          <div>
            {value === 1 && <div className={styles.tabContent}>
              <img src='./assets/img/empty.png' alt='empty' />
            </div>}
            {value === 2 &&
              <div className={styles.tabContent}>
                <ClassManagement />
              </div>}
            {value === 3 && <div className={styles.tabContent}>
              <TeacherManagement />
            </div>}
            {value === 4 && <div className={styles.tabContent}>
              <MembershipManagement />
            </div>}
            {value === 5 && <div className={styles.tabContent}>
              <BookingManagement />
            </div>}
          </div>
        </Box>
      )}
      {role === 'teacher' && teacherData && (
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
            <Tab label="Class" className={value === 2 ? styles.outlined : styles.plain}>Class</Tab>
          </Tabs>
          <div>
            {value === 1 && <div className={styles.tabContent}>
              <img src='./assets/img/empty.png' alt='empty' />
            </div>}
            {value === 2 &&
              <div className={styles.tabContent}>
                <Typography variant="h4" sx={{ paddingTop: '15px' }}>
                  Teaching class
                </Typography>
                <Grid container spacing={4} sx={{ padding: '25px' }}>
                  {teacherData.map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={4} xl={4}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="div"
                          sx={{
                            pt: '56.25%',
                          }}
                          image={card.image}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                            {card.time}
                            <DateRangeIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 2, mr: 1 }} />
                            {card.date}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex' }}>
                              <PersonIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                              {card.classSize - card.slotLeft} / {card.classSize}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Type: {card.type}
                          </Typography>
                        </CardContent>
                        <CardActions style={{ margin: '0 auto' }}>
                          <Link to={`${card.id}`}>
                            <Button variant='contained' sx={{ backgroundColor: '#6dabb4' }}>Student List</Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                  }
                </Grid>
              </div>}
          </div>
        </Box>
      )}
      {role === 'member' && memberData && (
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
              <Tab label="Booked class" className={value === 2 ? styles.outlined : styles.plain}>Booked class</Tab>
            </Tabs>
            <div>
              {value === 1 && <div className={styles.tabContent}>
                <img src='./assets/img/empty.png' alt='empty' />
              </div>}
              {value === 2 &&
                <div className={styles.tabContent}>
                  <Typography variant="h4" sx={{ paddingTop: '15px' }}>
                    Booked class
                  </Typography>
                  <Grid container spacing={4}>
                    {memberData.map((card) => (
                      <Grid item key={card.id} xs={12} sm={6} md={4} xl={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardMedia
                            component="div"
                            sx={{
                              pt: '56.25%',
                            }}
                            image={card.classInfo.image}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                              {card.classInfo.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                              {card.classInfo.time}
                              <DateRangeIcon sx={{ fontSize: 16, verticalAlign: 'middle', ml: 2, mr: 1 }} />
                              {card.classInfo.date}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex' }}>
                                <PersonIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                                {card.classInfo.slotLeft} / {card.classInfo.classSize}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Type: {card.classInfo.type}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>}
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Profile;
