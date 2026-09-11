import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Shield, FileLock, KeyRound, Cookie, Share2, Lock, UserCheck,
  ExternalLink, ShieldCheck, Mail, ArrowRight, Eye,
} from 'lucide-react'

const NAVY = '#001a4d'
const GOLD = '#c59b27'
const GOLD2 = '#d4af37'
const CREAM = '#faf5ea'
const BROWN = '#3a2a18'
const RED = '#8b2518'

const font = {
  vintage: { fontFamily: 'Cinzel, serif' },
  script: { fontFamily: 'Caveat, cursive' },
  display: { fontFamily: 'Playfair Display, serif' },
  body: { fontFamily: 'Inter, sans-serif' },
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function SectionHeading({ eyebrow, title, tagline }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
      <span className="text-xl tracking-wide" style={{ ...font.script, color: GOLD, display: 'inline-block' }}>{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-1 mb-2" style={{ ...font.vintage, color: NAVY }}>{title}</h2>
      <div className="flex items-center justify-center gap-3">
        <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
        <p className="italic text-base" style={{ ...font.display, color: 'rgba(58,42,24,0.7)' }}>{tagline}</p>
        <div className="h-[1.5px] w-12" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
      </div>
    </motion.div>
  )
}

function LegalSection({ icon: Icon, title, children }) {
  return (
    <motion.div variants={item} className="flex gap-4 sm:gap-5">
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mt-1"
        style={{ background: 'linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,175,55,0.08))', border: '1px dashed rgba(197,155,39,0.5)' }}>
        <Icon size={21} style={{ color: GOLD }} />
      </div>
      <div className="flex-1 pb-8 border-b" style={{ borderColor: 'rgba(180,160,130,0.22)' }}>
        <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>{title}</h3>
        {children}
      </div>
    </motion.div>
  )
}

const P = ({ children }) => (
  <p className="text-[14px] leading-relaxed mb-3" style={{ color: BROWN, ...font.body }}>{children}</p>
)

const UL = ({ children }) => (
  <ul className="mb-3 space-y-1.5">
    {children}
  </ul>
)

const LI = ({ children }) => (
  <li className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: BROWN, ...font.body }}>
    <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD2 }} />
    <span>{children}</span>
  </li>
)

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen relative"
      style={{
        backgroundColor: '#f5ecd8',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #fbf6ec 0%, #f0e3c5 60%, #e0cda5 100%),
          radial-gradient(#c7af85 0.75px, transparent 0.75px)`,
        backgroundSize: '100% 100%, 28px 28px',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(250,245,234,0.9)', border: '2px dashed rgba(197,155,39,0.6)', boxShadow: '0 10px 30px rgba(60,40,20,0.15)', transform: 'rotate(-6deg)' }}>
                  <Shield size={40} style={{ color: GOLD }} />
                </div>
                <motion.div className="absolute -right-2 -top-2" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                  <span className="text-2xl">✦</span>
                </motion.div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(18,43,73,0.06)', border: '1px solid rgba(18,43,73,0.15)' }}>
              <FileLock size={14} style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: NAVY, ...font.body }}>Legal</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1.5px] w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <span className="text-xl" style={{ color: GOLD }}>✦</span>
              <div className="h-[1.5px] w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>
            <p className="max-w-2xl mx-auto text-[15px] leading-relaxed" style={{ color: BROWN, ...font.body }}>
              Your trust matters to us. This policy explains how Alpine Explorers collects, uses and protects your personal information when you plan your adventures with us.
            </p>
            <p className="mt-4 inline-block px-5 py-2 rounded-full text-xs font-bold tracking-widest"
              style={{ ...font.vintage, color: NAVY, backgroundColor: 'rgba(197,155,39,0.1)', border: '1px dashed rgba(197,155,39,0.45)' }}>
              Last updated: 09 September 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="Know Your Rights" title="How We Handle Your Data" tagline="Transparent processes, honest policies" />

          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="rounded-2xl p-7 sm:p-9"
            style={{ backgroundColor: CREAM, boxShadow: '0 10px 32px rgba(60,40,20,0.13), 0 2px 6px rgba(60,40,20,0.06)', border: '1px solid rgba(180,160,130,0.28)' }}>
            <div className="absolute -top-3 left-10 w-14 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'rotate(2deg)' }} />

            <LegalSection icon={Eye} title="1. Introduction">
              <P>
                Alpine Explorers ("we", "our", "us") is committed to protecting the privacy of every traveller who explores the world with us. This Privacy Policy describes how we collect, use, store and safeguard your personal data when you use our website, services and booking platforms.
              </P>
              <P>
                By using our website and services, you agree to the practices described in this policy.
              </P>
            </LegalSection>

            <LegalSection icon={UserCheck} title="2. Information We Collect">
              <P>We collect information you share with us directly and information gathered automatically as you browse:</P>
              <UL>
                <LI><strong style={{ color: NAVY }}>Personal details</strong> – your name, email address, phone number and travel preferences provided through our contact forms and bookings.</LI>
                <LI><strong style={{ color: NAVY }}>Booking information</strong> – destination, travel dates, number of travellers, travel type and any special requirements.</LI>
                <LI><strong style={{ color: NAVY }}>Usage data</strong> – pages visited, time spent on the site and interactions, collected to improve your experience.</LI>
              </UL>
            </LegalSection>

            <LegalSection icon={KeyRound} title="3. How We Use Your Information">
              <UL>
                <LI>To respond to your enquiries and prepare customised travel itineraries &amp; quotes.</LI>
                <LI>To process bookings, confirmations and share tour-related updates.</LI>
                <LI>To improve our website, services and customer experience.</LI>
                <LI>To send promotional offers <em>(only with your consent, and you may opt out anytime)</em>.</LI>
              </UL>
            </LegalSection>

            <LegalSection icon={Cookie} title="4. Cookies &amp; Technologies">
              <P>
                Our website uses cookies and similar technologies to enhance functionality, remember your preferences and analyse site traffic. You can manage or disable cookies through your browser settings at any time; some features may not work as smoothly without them.
              </P>
            </LegalSection>

            <LegalSection icon={Share2} title="5. Sharing of Information">
              <P>
                We never sell your personal information. We may share data only when required – with trusted partners (such as airlines, hotels and ground operators) essential to fulfilling your planned travel, or with authorities where the law requires it.
              </P>
            </LegalSection>

            <LegalSection icon={Lock} title="6. Data Security">
              <P>
                We apply reasonable technical and organisational safeguards – including secure storage, restricted access and encrypted communication – to protect your information from unauthorised access, loss or misuse. No method of transmission over the internet is entirely secure, and we encourage you to use strong passwords where applicable.
              </P>
            </LegalSection>

            <LegalSection icon={ShieldCheck} title="7. Your Rights">
              <UL>
                <LI>Access and obtain a copy of the personal data we hold about you.</LI>
                <LI>Request correction of inaccurate or incomplete information.</LI>
                <LI>Request deletion of your data, subject to legal obligations.</LI>
                <LI>Withdraw consent for marketing communications at any time.</LI>
              </UL>
              <P>To exercise any of these rights, contact us using the details below.</P>
            </LegalSection>

            <LegalSection icon={ExternalLink} title="8. Third-Party Links">
              <P>
                Our website may link to external sites (e.g. Google Maps, partner pages). We are not responsible for the privacy practices of third-party websites and encourage you to review their policies when you leave our site.
              </P>
            </LegalSection>

            <LegalSection icon={Mail} title="9. Contact Us">
              <P>
                If you have questions about this policy or how we handle your data, reach out to our team:
              </P>
              <UL>
                <LI>Email us at <a href="mailto:info@alpineexplorers.com" className="font-semibold underline decoration-dotted underline-offset-2" style={{ color: NAVY }}>info@alpineexplorers.com</a></LI>
                <LI>Call us at <a href="tel:+919979883339" className="font-semibold underline decoration-dotted underline-offset-2" style={{ color: NAVY }}>+91 99798 83339</a></LI>
                <LI>Visit our head office in Rajkot – we're happy to help.</LI>
              </UL>
            </LegalSection>

            {/* Back link */}
            <motion.div variants={item} className="pt-4">
              <Link to="/" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase font-bold tracking-widest"
                style={{ backgroundColor: NAVY, color: '#fff', ...font.vintage, boxShadow: '0 8px 22px rgba(0,26,77,0.25)' }}>
                Back to Home <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" style={{ color: GOLD2 }} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}