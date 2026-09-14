import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext'
import AuthModal from './components/auth/AuthModal'
import RequireAuth from './components/RequireAuth'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Services from './pages/Services'
import ServicePage from './components/ServicePage'
import TourDetailsPage from './components/TourDetailsPage'
import Blog from './pages/Blog'
import UpcomingEvents from './pages/UpcomingEvents'
import TravelMood from './pages/TravelMood'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import BookingForm from './components/BookingForm'
import MyBookings from './pages/MyBookings'

import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ComingSoon from './components/admin/ComingSoon'
import { CalendarDays, MapPinned } from 'lucide-react'
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
import Bookings from './pages/admin/Bookings'
import BookingDetail from './pages/admin/BookingDetail'

function App() {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <Router>
          <AuthModal />
          <Routes>
            {/* ── Public website ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/tour/:id" element={<TourDetailsPage />} />
            <Route path="/upcoming-events" element={<UpcomingEvents />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/travel-mood" element={<TravelMood />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/booking/:id" element={
              <RequireAuth>
                <BookingForm />
              </RequireAuth>
            } />
            <Route path="/my-bookings" element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            } />

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ProtectedRoute permission="dashboard.view"><Dashboard /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute permission="dashboard.view"><Dashboard /></ProtectedRoute>} />
            <Route path="international" element={<ProtectedRoute permission="services.view"><InternationalPage /></ProtectedRoute>} />
            <Route path="domestic" element={<ProtectedRoute permission="services.view"><DomesticPage /></ProtectedRoute>} />
            <Route path="adventure" element={<ProtectedRoute permission="services.view"><AdventurePage /></ProtectedRoute>} />
            <Route path="camps" element={<ProtectedRoute permission="services.view"><CampsPage /></ProtectedRoute>} />
            <Route path="services" element={<ProtectedRoute permission="services.view"><ServicesPage /></ProtectedRoute>} />
            <Route path="blog" element={<ProtectedRoute permission="blog.view"><BlogPage /></ProtectedRoute>} />
            <Route path="events" element={<ProtectedRoute permission="events.view"><ComingSoon icon={CalendarDays} title="Upcoming Events" subtitle="Manage events, excursions & meetups" message="Upcoming events are currently defined in the public site code (src/pages/UpcomingEvents.jsx). A manager that lets you publish, edit and unpublish events directly from here is on the roadmap." note="Existing functionality is untouched — nothing is broken or removed." /></ProtectedRoute>} />
            <Route path="travel-mood" element={<ProtectedRoute permission="travel_mood.view"><ComingSoon icon={MapPinned} title="Find Your Travel Mood" subtitle="Manage travel moods & recommendations" message="Travel moods, destinations, budgets and recommendations are currently defined in the public site code (src/pages/TravelMood.jsx). A manager for these is on the roadmap." note="Existing functionality is untouched — nothing is broken or removed." /></ProtectedRoute>} />
            <Route path="media" element={<ProtectedRoute permission="services.view"><MediaLibrary /></ProtectedRoute>} />
            <Route path="homepage" element={<ProtectedRoute permission="dashboard.view"><HomepageAdmin /></ProtectedRoute>} />
            <Route path="about" element={<ProtectedRoute permission="about.view"><AboutAdmin /></ProtectedRoute>} />
            <Route path="bookings" element={<ProtectedRoute permission="bookings.view"><Bookings /></ProtectedRoute>} />
            <Route path="bookings/:id" element={<ProtectedRoute permission="bookings.view"><BookingDetail /></ProtectedRoute>} />
            <Route path="inquiries" element={<ProtectedRoute permission="contact.view"><Inquiries /></ProtectedRoute>} />
            <Route path="activity" element={<ProtectedRoute superAdminOnly={true}><ActivityLogs /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute superAdminOnly={true} permission="staff.view"><UsersAdmin /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute superAdminOnly={true} permission="settings.view"><SettingsAdmin /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    </SupabaseAuthProvider>
  )
}

export default App
