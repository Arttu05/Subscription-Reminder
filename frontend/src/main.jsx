import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FrameElem from './pageFrame.jsx'
import { RouterProvider, createBrowserRouter, useParams } from 'react-router-dom'
import LoginCard from './pages/login.jsx'
import RegisterCard from './pages/register.jsx'
import {AuthProvider } from './context.jsx'
import { DashboardElem } from './pages/dashboard.jsx'
import { AddReminderElem } from './pages/addReminder.jsx'
import { EditElem } from './pages/edit.jsx'

const router = createBrowserRouter([
  {
    element: <FrameElem />,
    children:[
      {path: "/", element: <LoginCard/>},
      {path: "/register", element: <RegisterCard/>},
      {path: "/dashboard", element: <DashboardElem/>},
      {path: "/add", element: <AddReminderElem/>},
      {path: "/edit/:id", element: <EditElem/>}
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
