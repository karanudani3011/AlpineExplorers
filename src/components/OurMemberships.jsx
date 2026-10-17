import { Award } from 'lucide-react'
import { motion } from '../animations/revealMotion'
import './OurMemberships.css'

const memberships = [
  { logo: '/logos/bni-rajkot.png', alt: 'BNI Rajkot logo', short: 'BNI', full: 'Business Network International' },
  { logo: '/logos/lvb.png', alt: 'Local Vocal Business logo', short: 'LVB', full: 'Local Vocal Business' },
  { logo: '/logos/tosg.webp', alt: 'Tour Operators Sustainable Group logo', short: 'TOSG', full: 'Tour Operators Sustainable Group' },
  { logo: '/logos/uten.png', alt: 'United Travels Events & Networking LLP logo', short: 'UTEN', full: 'United Travels Events & Networking LLP' },
  { logo: null, alt: null, short: 'GPCCS', full: null, extra: 'Board of Director' },
  { logo: null, alt: null, short: 'JTA', full: 'Jain Tourism Association' },
]

export default function OurMemberships() {
  return (
    <section className="our-memberships-section py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="our-memberships-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="our-memberships-top-rule" />
          <div className="our-memberships-content">
            <div className="our-memberships-intro">
              <div className="our-memberships-award"><Award size={24} strokeWidth={1.6} /></div>
              <h2>OUR MEMBERSHIPS</h2>
              <p className="our-memberships-subtitle">Associated with Prestigious National &amp; International Bodies</p>
              <p className="our-memberships-description">
                We are proud to be associated with leading national and international organizations, which uphold the highest standards in adventure tourism, safety and conservation.
              </p>
            </div>
            <div className="our-memberships-grid">
              {memberships.map((membership) => (
                <div className="our-membership" key={membership.short}>
                  <div className="our-membership-logo">
                    {membership.logo ? (
                      <img
                        src={membership.logo}
                        alt={membership.alt}
                        loading="lazy"
                        decoding="async"
                        style={membership.short === 'BNI' ? { borderRadius: '10px' } : undefined}
                      />
                    ) : (
                      <span className="our-membership-text-logo">{membership.short}</span>
                    )}
                  </div>
                  <div className="our-membership-divider" />
                  {membership.logo && <span className="our-membership-title">{membership.short}</span>}
                  {membership.full && <span className="our-membership-full">{membership.full}</span>}
                  {membership.extra && <span className="our-membership-extra">{membership.extra}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="our-memberships-trust">
            <div className="our-memberships-trust-line our-memberships-trust-line-left" />
            <span>A Record of Trust</span>
            <div className="our-memberships-trust-line our-memberships-trust-line-right" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
