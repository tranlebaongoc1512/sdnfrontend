import './App.css';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import Service from './components/Service/Service';
import ServiceDetails from './components/ServiceDetail/ServiceDetail';
import { useContext, useEffect } from 'react';
import BookingHistory from './components/BookingHistory/BookingHistory';

function App() {
  const { setUserAuthentication, userRole } = useContext(AuthContext);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    if (token && role) {
      setUserAuthentication(token, role);
    }
  }, [])
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/service' element={<Service />}></Route>

        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>

        <Route path='/profile' element={<Profile />}></Route>
        {userRole === 'provider' && (
          <Route path='/dashboard' element={<Dashboard />}></Route>)}
        {userRole === 'customer' && (
          <Route path='/booking-history' element={<BookingHistory />}></Route>)}
        <Route path='/service/:id' element={<ServiceDetails />}></Route>
      </Routes>
    </div>
  );
}

export default App;
