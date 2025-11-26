import React, { useEffect } from 'react'
import HomePage from '../src/pages/HomePage'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import {useAuthStore } from './store/useAuthStore'
import LoadingSpinner from './pages/LoadingSpinner '
import { Toaster } from 'react-hot-toast'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log(authUser);
  
  if (isCheckingAuth && authUser) return(
    <LoadingSpinner/>
  )

  return (

    <div data-theme="synthwave">
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/> }/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser ?  <ProfilePage/> : <Navigate to="/"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App