import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  ScrollText, FileCheck, CreditCard, Clock, ClipboardCheck, Stamp,
  Wallet, BadgeCheck, Scale, Mail, ArrowRight, Shield, AlertTriangle,
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

export default function TermsConditions() {
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
                  style={{ backgroundColor: 'rgba(250,245,234,0.9)', border: '2px dashed rgba(197,155,39,0.6)', boxShadow: '0 10px 30px rgba(60,40,20,0.15)', transform: 'rotate(6deg)' }}>
                  <ScrollText size={40} style={{ color: GOLD }} />
                </div>
                <motion.div className="absolute -right-2 -top-2" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                  <span className="text-2xl">✦</span>
                </motion.div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(18,43,73,0.06)', border: '1px solid rgba(18,43,73,0.15)' }}>
              <FileCheck size={14} style={{ color: GOLD }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: NAVY, ...font.body }}>Legal</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3" style={{ ...font.vintage, color: NAVY }}>
              Terms &amp; Conditions
            </h1>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1.5px] w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
              <span className="text-xl" style={{ color: GOLD }}>✦</span>
              <div className="h-[1.5px] w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
            </div>
            <p className="max-w-2xl mx-auto text-[15px] leading-relaxed" style={{ color: BROWN, ...font.body }}>
              Please read these terms carefully — they govern your use of our website, booking of tours and travel services with Alpine Explorers.
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
          <SectionHeading eyebrow="Clear &amp; Fair" title="Terms For Every Journey" tagline="Know before you go" />

          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="rounded-2xl p-7 sm:p-9"
            style={{ backgroundColor: CREAM, boxShadow: '0 10px 32px rgba(60,40,20,0.13), 0 2px 6px rgba(60,40,20,0.06)', border: '1px solid rgba(180,160,130,0.28)' }}>
            <div className="absolute -top-3 left-10 w-14 h-5 rounded-sm opacity-60" style={{ backgroundColor: 'rgba(245,230,196,0.9)', transform: 'rotate(2deg)' }} />

            <LegalSection icon={FileCheck} title="1. Acceptance of Terms">
              <P>
                By accessing this website or booking any tour with Alpine Explorers, you agree to be bound by these Terms &amp; Conditions and our Privacy Policy. If you do not agree with any part, please do not use our services.
              </P>
            </LegalSection>

            <LegalSection icon={ScrollText} title="2. Bookings &amp; Confirmation">
              <UL>
                <LI>Bookings are subject to availability and confirmation by Alpine Explorers.</LI>
                <LI>A booking is confirmed once you provide the required details and required deposit/payment is received.</LI>
                <LI>All itineraries, hotels and services are provided as per the confirmed plan agreed with you.</LI>
              </UL>
            </LegalSection>

            <LegalSection icon={CreditCard} title="3. Payments">
              <UL>
                <LI>Payments may be made through secure online/bank transfer channels as intimated at the time of booking.</LI>
                <LI>Quoted prices are in INR unless stated otherwise and may be revised due to currency fluctuations, fuel charges or statutory tax changes before full payment.</LI>
                <LI>Any charges for optional or add-on services not mentioned in the itinerary are payable by the guest directly.</LI>
              </UL>
            </LegalSection>

            <LegalSection icon={Clock} title="4. Cancellation Policy">
              <P>Cancellation charges apply once a booking is confirmed, depending on how close to departure a booking is cancelled:</P>
              <UL>
                <LI><strong style={{ color: NAVY }}>30+ days before departure</strong> – 10% of the tour cost.</LI>
                <LI><strong style={{ color: NAVY }}>16–29 days before departure</strong> – 30% of the tour cost.</LI>
                <LI><strong style={{ color: NAVY }}>8–15 days before departure</strong> – 50% of the tour cost.</LI>
                <LI><strong style={{ color: NAVY }}>0–7 days before departure / No-show</strong> – 100% of the tour cost.</LI>
              </UL>
              <P>Certain services (flights, cruises, premium hotels) may carry non-refundable terms; such conditions will be informed to you at the time of booking.</P>
            </LegalSection>

            <LegalSection icon={ClipboardCheck} title="5. Client Responsibilities">
              <UL>
                <LI>Ensure all information provided (names, passport details, contact numbers) is accurate.</LI>
                <LI>Report any pre-existing medical conditions that may affect participation in a tour.</LI>
                <LI>Follow tour guidelines, timings and local instructions given by our representatives.</LI>
                <LI>Carry valid identification and required travel documents for the journey.</LI>
              </UL>
            </LegalSection>

            <LegalSection icon={Stamp} title="6. Travel Documents &amp; Visa">
              <P>
                International travel requires valid passports, visas, permits and vaccination certificates. While we assist with guidance, obtaining documents on time remains the traveller's responsibility. Alpine Explorers is not liable for refusal of entry/exit by immigration authorities.
              </P>
            </LegalSection>

            <LegalSection icon={Wallet} title="7. Insurance">
              <P>
                We strongly recommend comprehensive travel insurance covering medical expenses, trip cancellation, baggage loss and personal liability for all domestic and international journeys.
              </P>
            </LegalSection>

            <LegalSection icon={AlertTriangle} title="8. Liability Disclaimer">
              <P>
                Alpine Explorers acts as an organiser and intermediary and will not be liable for loss, injury, damage or delay caused by third-party service providers (transport, hotels, local operators) or by events beyond our reasonable control. Claims remain limited to the amount paid to Alpine Explorers for the affected services.
              </P>
            </LegalSection>

            <LegalSection icon={Shield} title="9. Force Majeure">
              <P>
                We shall not be held responsible for failure to perform obligations due to events beyond reasonable control, including but not limited to natural disasters, war, strikes, epidemics/pandemics, government restrictions, or adverse weather.
              </P>
            </LegalSection>

            <LegalSection icon={BadgeCheck} title="10. Intellectual Property">
              <P>
                All content on this website – including text, photography, logos and design – belongs to Alpine Explorers or its licensors and may not be reproduced without prior written permission.
              </P>
            </LegalSection>

            <LegalSection icon={Scale} title="11. Governing Law">
              <P>
                These terms are governed by the laws of India. Any dispute shall be subject to the exclusive jurisdiction of the courts at <strong style={{ color: NAVY }}>Rajkot, Gujarat</strong>.
              </P>
            </LegalSection>

            <LegalSection icon={Mail} title="12. Contact Us">
              <P>
                For questions about these terms, contact us at:
              </P>
              <UL>
                <LI>Email: <a href="mailto:booking@alpineexplorers.com" className="font-semibold underline decoration-dotted underline-offset-2" style={{ color: NAVY }}>booking@alpineexplorers.com</a></LI>
                <LI>Phone: <a href="tel:+919825213245" className="font-semibold underline decoration-dotted underline-offset-2" style={{ color: NAVY }}>+91 98252 13245</a></LI>
                <LI>Office: B-309, The One World, Near Ayodhya Chowk, 150 Feet Ring Road, Rajkot - 360 006, Gujarat, India.</LI>
              </UL>
            </LegalSection>

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