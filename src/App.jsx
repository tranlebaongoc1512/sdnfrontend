import './App.css'
import Dashboard from './components/dashboard/Dashboard'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/dashboard' element={<Dashboard />}></Route>
      </Routes>
    </div>
  )
}

export default App
