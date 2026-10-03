import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext'

// ── Eagerly loaded (needed immediately on the "/" landing route) ──
import Landing from './pages/Landing'

// ── Global modal (lazy — only shown when user triggers auth) ──
const AuthModal = lazy(() => import('./components/auth/AuthModal'))
const RequireAuth = lazy(() => import('./components/RequireAuth'))

// ── Public pages (lazy — loaded only when user navigates to them) ──
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServicePage = lazy(() => import('./components/ServicePage'))
const TourDetailsPage = lazy(() => import('./components/TourDetailsPage'))
const Blog = lazy(() => import('./pages/Blog'))
const UpcomingEvents = lazy(() => import('./pages/UpcomingEvents'))
const TravelMood = lazy(() => import('./pages/TravelMood'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const BookingForm = lazy(() => import('./components/BookingForm'))
const MyBookings = lazy(() => import('./pages/MyBookings'))

// ── Admin pages (lazy — only loaded if user visits /admin/*) ──
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const MediaLibrary = lazy(() => import('./pages/admin/Media'))
const HomepageAdmin = lazy(() => import('./pages/admin/HomepageAdmin'))
const AboutAdmin = lazy(() => import('./pages/admin/AboutAdmin'))
const Inquiries = lazy(() => import('./pages/admin/Inquiries'))
const UsersAdmin = lazy(() => import('./pages/admin/UsersAdmin'))
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'))
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'))
const Bookings = lazy(() => import('./pages/admin/Bookings'))
const BookingDetail = lazy(() => import('./pages/admin/BookingDetail'))

// ── Admin ContentPages named-export shims (top-level so lazy() is stable) ──
const InternationalPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.InternationalPage }))
)
const DomesticPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.DomesticPage }))
)
const AdventurePage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.AdventurePage }))
)
const CampsPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.CampsPage }))
)
const ServicesPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.ServicesPage }))
)
const BlogPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.BlogPage }))
)
const EventsPage = lazy(() =>
  import('./pages/admin/ContentPages').then((m) => ({ default: m.EventsPage }))
)

// ── Lightweight loading fallback — visible only on non-landing navigations ──
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4ebd9',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(197,155,39,0.25)',
        borderTop: '3px solid #c59b27',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <Router>
          {/* AuthModal is global but only rendered when open (lazy to avoid upfront cost) */}
          <Suspense fallback={null}>
            <AuthModal />
          </Suspense>
          <Routes>
            {/* ── Public website ── */}
            {/* Landing is eagerly loaded — renders instantly */}
            <Route path="/" element={<Landing />} />

            <Route path="/home" element={
              <Suspense fallback={<PageLoader />}><Home /></Suspense>
            } />
            <Route path="/services" element={
              <Suspense fallback={<PageLoader />}><Services /></Suspense>
            } />
            <Route path="/services/:slug" element={
              <Suspense fallback={<PageLoader />}><ServicePage /></Suspense>
            } />
            <Route path="/tour/:id" element={
              <Suspense fallback={<PageLoader />}><TourDetailsPage /></Suspense>
            } />
            <Route path="/upcoming-events" element={
              <Suspense fallback={<PageLoader />}><UpcomingEvents /></Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}><Blog /></Suspense>
            } />
            <Route path="/travel-mood" element={
              <Suspense fallback={<PageLoader />}><TravelMood /></Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<PageLoader />}><About /></Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageLoader />}><Contact /></Suspense>
            } />
            <Route path="/privacy-policy" element={
              <Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense>
            } />
            <Route path="/terms" element={
              <Suspense fallback={<PageLoader />}><TermsConditions /></Suspense>
            } />
            <Route path="/booking/:id" element={
              <Suspense fallback={<PageLoader />}>
                <RequireAuth><BookingForm /></RequireAuth>
              </Suspense>
            } />
            <Route path="/my-bookings" element={
              <Suspense fallback={<PageLoader />}>
                <RequireAuth><MyBookings /></RequireAuth>
              </Suspense>
            } />

            {/* ── Admin ── */}
            <Route path="/admin/login" element={
              <Suspense fallback={<PageLoader />}><Login /></Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute><AdminLayout /></ProtectedRoute>
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="dashboard.view"><Dashboard /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="dashboard.view"><Dashboard /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="international" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><InternationalPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="domestic" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><DomesticPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="adventure" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><AdventurePage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="camps" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><CampsPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="services" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><ServicesPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="blog" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="blog.view"><BlogPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="events" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="events.view"><EventsPage /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="media" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="services.view"><MediaLibrary /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="homepage" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="dashboard.view"><HomepageAdmin /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="about" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="about.view"><AboutAdmin /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="bookings" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="bookings.view"><Bookings /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="bookings/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="bookings.view"><BookingDetail /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="inquiries" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute permission="contact.view"><Inquiries /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="activity" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute superAdminOnly={true}><ActivityLogs /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute superAdminOnly={true} permission="staff.view"><UsersAdmin /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute superAdminOnly={true} permission="settings.view"><SettingsAdmin /></ProtectedRoute>
                </Suspense>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SupabaseAuthProvider>
  )
}

export default App
