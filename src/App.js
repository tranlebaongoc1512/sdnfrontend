import './App.css';
import Footer from '../src/components/Footer/Footer'
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Class from './components/Class/Class';
import { Route, Routes } from 'react-router-dom';
import Teacher from './components/Teacher/Teacher';
import ClassDetails from './components/ClassDetail/ClassDetail';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/service' element={<Class />}></Route>
          <Route path='/teacher' element={<Teacher />}></Route>

        <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>   

          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/service/:id' element={<ClassDetails />}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
