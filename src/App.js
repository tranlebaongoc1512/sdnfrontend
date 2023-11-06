import './App.css';
import Footer from '../src/components/Footer/Footer'
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import Service from './components/Service/Service';
import ServiceDetails from './components/ServiceDetail/ServiceDetail';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/service' element={<Service />}></Route>

          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>

          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/service/:id' element={<ServiceDetails />}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
