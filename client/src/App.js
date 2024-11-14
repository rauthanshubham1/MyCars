import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AddCar from './Components/AddCar';
import AllCars from './Components/AllCars';
import CarDetail from './Components/CarDetails';
import Home from './Components/Home';
import NotFound from './Components/NotFound';  

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addcar" element={<AddCar />} />
        <Route path="/allcars" element={<AllCars />} />
        <Route path="/cardetails/:id" element={<CarDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
