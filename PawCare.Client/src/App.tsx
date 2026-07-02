import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'

import Home from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pets from './pages/Pets'
import PetForm from './pages/PetForm'
import { Veterinarians } from './pages/Veterinarians'
import { BookAppointment } from './pages/BookAppointment'
import { Appointments } from './pages/Appointments'
import { Layout } from "./pages/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                //#region Pets
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/new" element={<PetForm />} />
                <Route path="/pets/:id/edit" element={<PetForm />} />
                //#endregion
                <Route path="/veterinarians" element={<Veterinarians />} />
                <Route path="/book/:vetId" element={<BookAppointment />} />
                <Route path="/appointments" element={<Appointments />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}