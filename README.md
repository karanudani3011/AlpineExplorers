# Alpine Explorers - Travel & Tourism Website

A modern, premium travel website built with **React.js + Vite**, featuring cinematic animations, interactive components, and a fully responsive design.

## 🌍 Features

### 🎨 Landing Page
- **Vintage travel scrapbook aesthetic** with animated elements
- Smooth cinematic animations with GSAP
- Torn paper effects, vintage maps, and travel stickers
- CTA button with page transition animation to home

### 📱 Responsive Design
- **Desktop, Tablet, and Mobile** optimized layouts
- Hamburger navigation for mobile
- Touch-friendly buttons and interactions
- Optimized image loading

### 🎯 Core Pages

#### Home Dashboard
- Hero section with search/travel planner card
- Popular destinations (horizontally scrollable)
- Trending tours with filterable badges
- Experience categories (Culture, Food, Wildlife, Photography, Local Life)
- Why Choose Us section with animated counters
- Professional navigation and footer

#### Services
- 5 service categories (International, Domestic, Mountain, Adventure, Family)
- Featured tours grid
- Service details with descriptions
- CTA buttons

#### Tour Details
- Large hero image with overlay
- Quick info cards (duration, dates, difficulty, group size)
- Day-wise itinerary with accordion expansion
- Inclusions and exclusions
- Sticky booking sidebar with pricing
- Like/Share functionality

#### Blog
- Blog cards with category filters
- Search functionality
- Category-based filtering
- Newsletter subscription CTA

#### Travel Mood Selector
- 3-step interactive quiz (Mood → Destination → Budget)
- Animated progress indicators
- Recommended tours based on selections
- Smooth step transitions

#### About Us
- Company story and mission/vision
- Animated counters for statistics
- Core values section
- Team member profiles

#### Contact Us
- Multiple contact methods (Phone, Email, WhatsApp)
- Contact form with validation
- Office hours information
- FAQ accordion
- Map placeholder

### 🎬 Animations & Interactions
- **Framer Motion** for component animations
- **GSAP** for advanced scroll and timeline animations
- Page transitions with fade and scale effects
- Staggered animations for card grids
- Floating elements with parallax
- Hover effects and button micro-interactions
- Smooth scrolling and transitions
- Accessibility-friendly (respects prefers-reduced-motion)

### 🎨 Design System
- **Color Palette**: Deep navy, ocean blue, teal, warm beige, orange accents
- **Typography**: Modern sans-serif for UI, elegant display font for headings
- **Components**: Rounded cards, glassmorphism, soft shadows, gradient overlays
- **Tailwind CSS** for styling
- Custom animations and keyframes

### 🚀 Tech Stack
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - React animations
- **GSAP** - Advanced animations
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Navigate to project directory
cd d:\AlpineExplorers

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm npm preview
```

The application will open at `http://localhost:5173/`

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Navigation bar
│   ├── Footer.jsx           # Footer
│   ├── TourCard.jsx         # Tour card component
│   ├── DestinationCard.jsx  # Destination card
│   ├── BlogCard.jsx         # Blog card
│   ├── ExperienceCard.jsx   # Experience category card
│   ├── AnimatedCounter.jsx  # Animated number counter
│   └── BookingForm.jsx      # Multi-step booking form
│
├── pages/
│   ├── Landing.jsx          # Landing/intro page
│   ├── Home.jsx             # Home dashboard
│   ├── Services.jsx         # Services listing
│   ├── TourDetails.jsx      # Tour detail page
│   ├── Blog.jsx             # Blog page
│   ├── TravelMood.jsx       # Travel mood selector
│   ├── About.jsx            # About us page
│   └── Contact.jsx          # Contact page
│
├── data/
│   └── data.js              # Sample data (tours, destinations, blogs, etc.)
│
├── animations/
│   └── variants.js          # Framer Motion animation variants
│
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
├── index.css                # Global styles
└── index.html               # HTML template
```

## 🎨 Customization

### Colors
Edit Tailwind config in `tailwind.config.js`:
```js
colors: {
  primary: { ... },
  navy: '#001a4d',
  teal: '#14b8a6',
  beige: '#f5e6d3',
}
```

### Animations
Modify animation variants in `src/animations/variants.js` or component-level animations in Framer Motion `motion` props.

### Sample Data
Update tour, destination, blog data in `src/data/data.js`

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Vercel** - `npm i -g vercel && vercel`
- **Netlify** - Connect GitHub repo to Netlify
- **GitHub Pages** - `npm run build && gh-pages -d dist`
- **Traditional Hosting** - Upload `dist/` folder

## 🚀 Performance Optimizations
- Image optimization with Unsplash CDN
- Code splitting with React Router
- Lazy loading for routes
- Minified production build
- Optimized animations with hardware acceleration

## ✅ Features Checklist
- [x] Cinematic landing page with animations
- [x] Responsive navigation
- [x] Home dashboard with multiple sections
- [x] Tour browsing and details page
- [x] Multi-step booking form
- [x] Blog with filtering and search
- [x] Interactive travel mood selector
- [x] About and contact pages
- [x] Smooth page transitions
- [x] Animated components and counters
- [x] WhatsApp integration CTA
- [x] Mobile-friendly design
- [x] Accessibility features

## 📝 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use:
```bash
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

## 📄 License
This project is open source and available under the MIT License.

## 👥 Contributing
Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support
For support, contact info@alpineexplorers.com or visit the Contact page.

---

**Built with ❤️ by Alpine Explorers Team**
