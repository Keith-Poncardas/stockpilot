import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './routes'
import AuthLayout from './layout/AuthLayout'
import { LoginPage, UserLayout, UserPage, UserViewPage } from './features'
import MainLayout from './layout/MainLayout'

function App() {
  return (
    <Routes>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1>Home Page</h1>} />

          <Route path="/users" element={<UserLayout />}>
            <Route index element={<UserPage />} />
            <Route path=":userId/view" element={<UserViewPage />} />
          </Route>

        </Route>
      </Route>

    </Routes>
  )
}

export default App
