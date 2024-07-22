import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import Carts from '../components/pages/Carts';
import EmployeeDetails from '../components/pages/EmployeeDetails';
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import ProfileSection from '../components/pages/ProfileSection';
import Rating from '../components/pages/Rating';
import Registration from '../components/pages/Registration';
import RequestResource from '../components/pages/RequestResource';
import Shorting from '../components/pages/Shorting';
import TaskForm from '../components/pages/TaskForm';
import UploadForm from '../components/pages/UploadForm';
import { useAuthContext } from '../context/AuthContext';

const Routing = () => {
  const { authUser } = useAuthContext();
  return (
  

    <Routes>
       
        <Route path='/' element={authUser ? <Home/> : <Navigate to={"/Login"} />} />
				<Route path='/Login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path="/upload" element={authUser ?<UploadForm/>:<Registration/>}></Route>
				<Route path='/Registration' element={ authUser ?<Carts/>:<Registration />} />
        <Route path='/TaskForm' element={<TaskForm />}></Route>
        <Route path='/tasks' element={authUser ? <Carts />:<Registration/>}></Route>
        <Route path="/requirement" element={authUser ?<RequestResource />:<Registration/>}></Route>
        <Route path="/Assigned Task" element={authUser ?<TaskForm />:<Registration/>}></Route>
       
        <Route path="/rating" element={authUser?<Shorting/>:<Registration/>}></Route>
        <Route path="/profile" element={ <ProfileSection />}/>
        <Route path="/employee" element={ <EmployeeDetails />}/>
        <Route path="/ratings" element={<Rating/>}/>

  

    </Routes>
  
    
    

  )
}

export default Routing
