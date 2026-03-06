import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routingconfig'
import AuthContextProvider from './Context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
const queryClient = new QueryClient()
export default function App() {
  return <>
  
  <QueryClientProvider client={queryClient}>
  <AuthContextProvider>
  <RouterProvider router={routes} />
  <Toaster/>
  </AuthContextProvider>
  </QueryClientProvider>

  
  </>
}
