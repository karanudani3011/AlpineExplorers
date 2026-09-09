import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Services from './pages/Services'
import TourDetails from './pages/TourDetails'
import Blog from './pages/Blog'
import TravelMood from './pages/TravelMood'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import BookingForm from './components/BookingForm'

import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import { InternationalPage, DomesticPage, AdventurePage, CampsPage, ServicesPage, BlogPage } from './pages/admin/ContentPages'
import MediaLibrary from './pages/admin/Media'
import HomepageAdmin from './pages/admin/HomepageAdmin'
import AboutAdmin from './pages/admin/AboutAdmin'
import Inquiries from './pages/admin/Inquiries'
import UsersAdmin from './pages/admin/UsersAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'
import ActivityLogs from './pages/admin/ActivityLogs'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public website ── */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/travel-mood" element={<TravelMood />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/booking/:id" element={<BookingForm />} />

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="international" element={<InternationalPage />} />
            <Route path="domestic" element={<DomesticPage />} />
            <Route path="adventure" element={<AdventurePage />} />
            <Route path="camps" element={<CampsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="homepage" element={<ProtectedRoute roles={['super_admin', 'admin']}><HomepageAdmin /></ProtectedRoute>} />
            <Route path="about" element={<ProtectedRoute roles={['super_admin', 'admin']}><AboutAdmin /></ProtectedRoute>} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="activity" element={<ProtectedRoute roles={['super_admin']}><ActivityLogs /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute roles={['super_admin']}><UsersAdmin /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute roles={['super_admin']}><SettingsAdmin /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App