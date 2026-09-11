import bcrypt from 'bcryptjs'
import { db, logActivity } from './db.js'

const seeded = () => db.prepare('SELECT COUNT(*) c FROM users').get().c > 0

function hasAny(table) {
  return db.prepare(`SELECT COUNT(*) c FROM ${table}`).get().c > 0
}

async function main() {
  if (seeded()) {
    console.log('Database already seeded. Skipping.')
    process.exit(0)
  }

  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10)

  /* Super Admin */
  db.prepare(`INSERT INTO users (full_name, username, email, phone, password_hash, role, status)
    VALUES ('Super Administrator', 'admin', 'admin@alpineexplorers.com', '', ?, 'super_admin', 'active')`).run(hash)

  db.prepare(`INSERT INTO users (full_name, username, email, phone, password_hash, role, status)
    VALUES ('Content Editor', 'editor', 'editor@alpineexplorers.com', '', ?, 'editor', 'active')`).run(bcrypt.hashSync('editor123', 10))

  /* ── International Packages ── */
  const intr = db.prepare(`INSERT INTO international_packages
    (destination, country, duration, short_description, full_description, price, original_price,
     air_ticket, passport_visa, pickup_drop, accommodation, food, sightseeing, guidance, image, gallery, featured, status)
    VALUES (?,?,?,?,?,?,?,1,1,1,1,1,1,1,?,?,?,?)`)

  const iSeed = [
    ['Thailand & Bangkok', 'Thailand', '5N/6D · 7N/8D', 'Temple trails & night markets', 'Explore the Land of Smiles with Bangkok city lights, ancient temples and floating markets.', null, null, 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=500&h=360&fit=crop', '[]', 1, 'active'],
    ['Exclusive Europe', 'Multi-Country', 'Multi-Country', 'Iconic capitals & heritage rail', 'A grand tour of Europe\u2019s iconic capitals with scenic rail journeys and heritage stays.', null, null, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&h=360&fit=crop', '[]', 1, 'active'],
    ['Bali', 'Indonesia', '5N/6D · 7N/8D', 'Island temples & Ubud valleys', 'Tropical paradise with island temples, Ubud valleys, beaches and Balinese culture.', 1299, 1699, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&h=360&fit=crop', '[]', 1, 'active'],
    ['Phuket & Krabi', 'Thailand', '5N/6D · 7N/8D', 'Long-tails, karsts & coral bays', 'Thailand\u2019s southern coast with longtail boats, limestone karsts and coral bays.', null, null, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Singapore & Malaysia', 'Singapore / Malaysia', '6N/7D · 7N/8D', 'Gardens, gleaming towers & straits', 'Modern towers, lush gardens and cross-border adventures across the straits.', null, null, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Sri Lanka', 'Sri Lanka', '6N/7D · 7N/8D', 'Tea country & ancient cities', 'Tea estates, ancient cities and coastal charm across the teardrop island.', null, null, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Maldives', 'Maldives', '4N/5D', 'Overwater villas & lagoons', 'Overwater villas, turquoise lagoons and serene island luxury.', null, null, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&h=360&fit=crop', '[]', 1, 'active'],
    ['Lakshadweep', 'India', '4N/5D', 'India\u2019s untouched atolls', 'India\u2019s untouched coral atolls with pristine lagoons and marine life.', null, null, 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Vietnam', 'Vietnam', '6N/7D · 9N/10D', 'Ha Long Bay & lantern towns', 'Ha Long Bay cruises, lantern towns and vibrant Vietnamese culture.', null, null, 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Baku', 'Azerbaijan', '5N/6D · 7N/8D', 'Flame towers & Caspian coast', 'Modern flame towers, old city walls and the Caspian coastline.', null, null, 'https://images.unsplash.com/photo-1583577312971-b7ff2f853f20?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Dubai', 'UAE', '5N/6D · 6N/7D', 'Skyline, desert & souks', 'Futuristic skyline, desert safaris and traditional souks.', null, null, 'https://images.unsplash.com/photo-1512453395758-6b78f76b7f0e?w=500&h=360&fit=crop', '[]', 1, 'active'],
    ['Bhutan', 'Bhutan', '6N/7D · 9N/10D', 'Tiger\u2019s Nest & Himalayan valleys', 'Himalayan valleys, monasteries and the Tiger\u2019s Nest.', null, null, 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=500&h=360&fit=crop', '[]', 0, 'active'],
    ['Cruise Line', 'International', '1N/2D · 2N/3D · 3N/4D', 'Open-sea voyages at leisure', 'Open-sea voyages with onboard entertainment and destinations en route.', null, null, 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&h=360&fit=crop', '[]', 0, 'active'],
  ]
  for (const p of iSeed) intr.run(...p)

  /* ── Domestic Packages ── */
  const dom = db.prepare(`INSERT INTO domestic_packages
    (destination, state, duration, season, short_description, full_description, price, transportation, accommodation, food, sightseeing, activities, image, gallery, status)
    VALUES (?,?,?,?,?,?,?,1,1,1,1,?,?,?,?)`)
  const dSeed = [
    ['Kashmir & Himachal', 'Jammu & Kashmir / Himachal Pradesh', '6N/7D · 7N/8D', 'All seasons', 'Dal Lake & pine valleys', 'Shikara rides on Dal Lake, alpine pine valleys and Himalayan serenity.', null, '["Srinagar","Gulmarg","Pahalgam","Kullu","Manali"]', 'https://images.unsplash.com/photo-1583249598640-3cae04577837?w=500&h=360&fit=crop', '[]', 'active'],
    ['Goa', 'Goa', '6N/7D · 7N/8D', 'All seasons', 'Golden sands & old quarters', 'Golden beaches, old Portuguese quarters and vibrant nightlife.', null, '["Beach Activities","Old Goa","Water Sports","Night Market"]', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=360&fit=crop', '[]', 'active'],
    ['Kerala', 'Kerala', '5N/6D · 6N/7D', 'All seasons', 'Backwaters & spice hills', 'Backwaters, spice hills and tropical greenery in God\u2019s Own Country.', null, '["Backwater Cruise","Munnar","Spice Plantation","Kathakali"]', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=360&fit=crop', '[]', 'active'],
    ['Andaman', 'Andaman & Nicobar', '4N/5D', 'All seasons', 'Crystal bays & coral reefs', 'Crystal bays, coral reefs and tropical island adventures.', null, '["Snorkeling","Cellular Jail","Scuba Diving","Beach Trekking"]', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=360&fit=crop', '[]', 'active'],
    ['Seven Sisters', 'North East India', '5N/6D · 7N/8D', 'All seasons', 'Arunachal · Assam · Meghalaya · Manipur · Mizoram · Nagaland · Tripura', 'A journey through the seven northeastern states of India.', null, '["Meghalaya Caves","Kaziranga","Tea Gardens","Tribal Culture"]', 'https://images.unsplash.com/photo-1589227365533-3f8540e87232?w=500&h=360&fit=crop', '[]', 'active'],
    ['Sikkim', 'Sikkim', '5N/6D · 7N/8D', 'All seasons', 'Tsomgo Lake & Kanchenjunga', 'Himalayan monasteries, Tsomgo Lake and views of Kanchenjunga.', null, '["Gangtok","Tsomgo Lake","Nathula Pass","Monasteries"]', 'https://images.unsplash.com/photo-1587645585583-5b2a1e72d36a?w=500&h=360&fit=crop', '[]', 'active'],
    ['Rajasthan', 'Rajasthan', '5N/6D · 6N/7D', 'Oct – Mar', 'Forts, lakes & royal cities', 'Majestic forts, lakes and royal heritage cities.', null, '["Jaipur","Udaipur","Jodhpur","Jaisalmer"]', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=360&fit=crop', '[]', 'active'],
    ['Manali – Leh Biking', 'Himachal Pradesh / Ladakh', '8D/7N', 'Jun – Sep', 'Delhi–Srinagar · 3 Star Hotels/Camps · Inner Line Permit', 'Epic biking expedition from Manali to Leh with hotels and camps.', null, '["Biking","Camping","Inner Line Permit","Mountain Passes"]', 'https://images.unsplash.com/photo-1547203664-e4b3a9d1c501?w=500&h=360&fit=crop', '[]', 'active'],
    ['Leh – Ladakh Biking', 'Ladakh', '7N/8D', 'Apr – Oct', 'Ex. Delhi by Flight · Camps & Permits', 'High-altitude biking through Ladakh\u2019s barren beauty.', null, '["Biking","Camps","Permits","High Passes"]', 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&h=360&fit=crop', '[]', 'active'],
  ]
  for (const p of dSeed) dom.run(...p)

  /* ── Adventure Packages ── */
  const adv = db.prepare(`INSERT INTO adventure_packages
    (title, category, location, duration, season, ex, description, activities, includes, image, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,'active')`)
  const aSeed = [
    ['Brahmatal Trek', 'Trekking', 'Uttarakhand', '9D/8N', 'December – February', 'Ex. Gujarat / Ex. Delhi', 'Snow-trek to Brahmatal lake with panoramic Himalayan views.', '["Snow Trekking","Camping","Wildlife Spotting"]', '["Train","Accommodation","Food","Sightseeing","Adventure Activities"]', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=360&fit=crop'],
    ['Kedarkantha Trek', 'Trekking', 'Uttarakhand', '9D/8N', 'December – February', 'Ex. Gujarat', 'Classic winter trek ascending Kedarkantha summit.', '["Snow Trekking","Summit Ascent","Camping"]', '["Train","Transportation","Food","Sightseeing","Accommodation","Adventure Activities"]', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&h=360&fit=crop'],
    ['Chopta – Rishikesh', 'Trekking', 'Uttarakhand', '9D/8N', 'December – February', 'Ex. Gujarat / Ex. Delhi', 'Trek across Chopta with Tungnath temple, Chandrashila peak and Deoria Tal lake.', '["Tungnath Temple","Chandrashila Peak","Deoria Tal Lake"]', '["Adventure Activities","Rishikesh Sightseeing"]', 'https://images.unsplash.com/photo-1506097425191-7ad538b29cef?w=500&h=360&fit=crop'],
    ['Manali – Kasol Backpacking', 'Trekking', 'Himachal Pradesh', '10D/9N', 'December – March', 'Ex. Gujarat', 'Budget backpacking through Manali and Kasol valleys.', '["Backpacking","Camping","Nature Walks"]', '["Train Transportation","Accommodation","Food","Adventure","Sightseeing"]', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=500&h=360&fit=crop'],
    ['Winter Spiti – Himachal', 'Trekking', 'Himachal Pradesh', '10D/9N', 'Winter Expedition', 'Ex. Delhi', 'Cold-desert expedition through winter Spiti valley.', '["Cold Desert","Monasteries","High Passes"]', '["Transportation","Accommodation","Food","Cold-Desert Guide","Inner Line Permit"]', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&h=360&fit=crop'],
    ['Manali Adventure Camp', 'Adventure Camp', 'Manali', '2N/3D', 'April – May', 'Camp', 'Rock climbing, rappelling, snow craft and rafting in Manali.', '["Rock Climbing","Rappelling","Snow Craft","Paragliding","Rafting","Trekking","Sports"]', '["Tent Accommodation","Food","Transportation","Campfire"]', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=360&fit=crop'],
    ['Mussoorie Adventure Camp', 'Adventure Camp', 'Mussoorie', '2N/3D', 'April – May', 'Camp', 'Adventure activities amid the hills of Mussoorie.', '["Rock Climbing","Rappelling","Trekking","Sports"]', '["Tent Accommodation","Food","Transportation"]', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=360&fit=crop'],
    ['Dalhousie Adventure Camp', 'Adventure Camp', 'Dalhousie', '2N/3D', 'April – May', 'Camp', 'Nature and adventure camp in serene Dalhousie.', '["Trekking","Nature Study","Campfire"]', '["Tent Accommodation","Food","Transportation"]', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=360&fit=crop'],
  ]
  for (const p of aSeed) adv.run(...p)

  /* ── Camping Packages ── */
  const camp = db.prepare(`INSERT INTO camping_packages
    (title, location, duration, season, description, activities, accommodation, food, charges, rules, what_to_bring, certificates, image, gallery, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
  camp.run('Gir Lion Sanctuary Camp', 'Sasan Gir, Gujarat', '2N/3D', 'November – March', 'Wildlife camping in the only home of the Asiatic Lion.', '["Lion Spotting","Bird Watching","Jungle Trek","Campfire"]', 'Alpine tents · 4-6 persons · separate for boys & girls', 'Vegetarian · nutritious · hygienic', 'On request', '["Follow guide instructions","Stay inside camp at night"]', '["Warm clothes","Trekking shoes","Torch"]', 'Certificates of merit awarded', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Family Camping', 'Gujarat', '1N/2D', 'All seasons', 'One tent per family with a comfortable camping setup for families and school groups.', '["Lion Spotting","Wildlife Awareness","Crocodile Breeding Centre","Museum Visit","Wildlife Film Show","Campfire","Jeep Safari (optional)"]', 'One tent per family · sleeping bags provided', 'All meals included', 'On request', '["Children under 10 must be accompanied"]', '["Comfortable clothing","Personal medicines"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=380&fit=crop', '[]', 'active')
  camp.run('Marine Nature Study Camp', 'Jamnagar, Gujarat', '2D/1N', 'December – February', 'Inter-tidal exploration across the Gulf of Kutch islands.', '["Marine Life Exploration","Coral Observation","Jellyfish","Sea Anemones","Octopus","Turtles","Puffer Fish","Dolphins","Migratory Birds","Beach Trekking","Nature Study","Island Exploration"]', 'Alpine tents', 'All meals included', 'On request', '["Walk only on designated reef flats"]', '["Water shoes","Sun protection"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Pirotan Island Camp', 'Jamnagar, Gujarat', '2D/1N', 'December – February', 'Rare opportunity to walk the reef flats at low tide on Pirotan Island.', '["Marine Life","Coral Observation","Island Trekking","Bird Watching"]', 'Alpine tents', 'All meals included', 'On request', '["Island entry governed by wildlife rules"]', '["Water shoes","Sun protection"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Narara Island Camp', 'Jamnagar, Gujarat', '2D/1N', 'December – February', 'Marine camp at Narara island reefs with dolphin spotting.', '["Marine Life","Dolphin Spotting","Coral Observation","Beach Trekking"]', 'Alpine tents', 'All meals included', 'On request', '["Follow local marine guides"]', '["Water shoes","Sun protection"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Saputara Weekend Camp', 'Saputara, Gujarat', '3D/2N', 'Every Weekend', 'Weekend adventure camp in the hills of Saputara.', '["Adventure Activities","Tent Accommodation","Campfire","Trekking","Transportation","Food","Games"]', 'Tent accommodation', 'All meals included', 'On request', '["Report at collection point on time"]', '["Warm clothes","Torch"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Beyt Dwarka Marine Camp', 'Beyt Dwarka, Gujarat', '3D/2N · 2D/1N', 'December – February', 'Coastal marine camp with dolphin spotting and marine life exploration.', '["Boating","Marine Life Exploration","Dolphin Spotting","Bird Watching","Swimming","Campfire","Beach Trekking","Games","Star Gazing","Night Trekking"]', 'Tent accommodation', 'All meals included', 'On request', '["Scuba Diving excluded"]', '["Swimwear","Water shoes"]', 'Certificate on completion', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=360&fit=crop', '[]', 'active')
  camp.run('Jaisalmer Desert Camp', 'Jaisalmer, Rajasthan', '4N/3D', 'October – March', 'Desert camping with camel safaris, camps and cultural nights.', '["Jeep Safari","Camel Safari","Campfire","DJ","Sightseeing"]', 'Swiss tents', 'All meals included', 'On request', '["Desert nights are cold — carry warm clothes"]', '["Warm clothes","Camera"]', '—', 'https://images.unsplash.com/photo-1521133573892-e44906baee46?w=500&h=360&fit=crop', '[]', 'active')

  /* ── Services ── */
  if (!hasAny('services')) {
    const svc = db.prepare(`INSERT INTO services (icon, title, description, category, status) VALUES (?,?,?,?,'active')`)
    const services = [
      ['Plane', 'Airline Booking', 'Domestic & international flight reservations', 'Travel'],
      ['Building2', 'Hotel & Resort Booking', 'Curated stays across every budget', 'Travel'],
      ['FileCheck', 'Passport & Visa Assistance', 'Complete documentation guidance', 'Travel'],
      ['Banknote', 'Forex / Money Transfer', 'Best forex rates & safe transfers', 'Travel'],
      ['Heart', 'Honeymoon Packages', 'Romantic escapes crafted for two', 'Tour'],
      ['Users', 'Customized Family Packages', 'Tailor-made journeys for families', 'Tour'],
      ['Ship', 'Cruise Booking', 'Luxury cruise itineraries worldwide', 'Travel'],
      ['Tent', 'Family Tours', 'Family camping and getaway trips', 'Tour'],
      ['Trees', 'Family Camping', 'Comfortable one-tent-per-family camping', 'Camping'],
      ['Mountain', 'Weekend Camps', 'Saputara, Gir and weekend escapes', 'Camping'],
      ['TreePine', 'Nature Camps', 'Gir, marine and nature study camps', 'Camping'],
      ['GraduationCap', 'School Tours', 'Educational adventure tours for schools', 'Education'],
      ['GraduationCap', 'College Tours', 'College and institution trips', 'Education'],
      ['Users', 'Group Tours', 'Group travel packages', 'Tour'],
      ['Globe', 'Group Picnics', 'Curated picnic arrangements for groups', 'Tour'],
    ]
    for (const s of services) svc.run(...s)
  }

  /* ── Blogs ── */
  if (!hasAny('blogs')) {
    const b = db.prepare(`INSERT INTO blogs (title, slug, category, author, cover_image, short_description, content, tags, publish_date, featured, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    b.run('Top 10 Himalayan Treks for Beginners', 'top-10-himalayan-treks-beginners', 'Trekking', 'Alpine Explorers', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop', 'Start your trekking journey with these beginner-friendly Himalayan trails.',
      'Kedarkantha, Brahmatal and Chopta offer the perfect first taste of Himalayan trekking. Trained guides, comfortable camps and curated inclusions make the journey safe and memorable.\\n\\nEvery winter our trekkers summit peaks between 12,000 and 14,000 feet with proper acclimatization plans and certified instructors.',
      '["Trekking","Himalayas","Beginner"]', new Date().toISOString().slice(0, 10), 1, 'published')
    b.run('The Best Time to Visit the Maldives', 'best-time-visit-maldives', 'Beaches', 'Alpine Explorers', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=400&fit=crop', 'Plan the perfect island escape with our seasonal guide to the Maldives.',
      'The Maldives shines from November to April with clear skies and calm seas. Overwater villas, coral reefs and dolphin cruises make it an unmatched tropical retreat packaged by Alpine Explorers.',
      '["Maldives","Beaches","Islands"]', new Date().toISOString().slice(0, 10), 0, 'published')
    b.run('Family Camping at Sasan Gir', 'family-camping-sasan-gir', 'Camping', 'Alpine Explorers', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=400&fit=crop', 'Wildlife awareness, campfires and lion territory — the perfect family weekend.',
      'Our Gir family camp blends wildlife awareness, museum visits, a lion-spotting jeep safari and cozy campfire evenings. One tent per family, sleeping bags provided, and certified nature guides throughout.',
      '["Camping","Wildlife","Family"]', new Date().toISOString().slice(0, 10), 0, 'published')
  }

  /* ── Homepage ── */
  const hp = db.prepare(`INSERT INTO homepage (id, hero_title, hero_subtitle, hero_image, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, sections, content) VALUES (1,?,?,?,?,?,?,?,?,?)`)
  hp.run(
    'Explore. Adventure. Experience.',
    'Discover unforgettable journeys with Alpine Explorers',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
    'Explore Tours', '/services', 'Contact Us', '/contact',
    JSON.stringify({
      hero: true, popular_destinations: true, trending_tours: true, experiences: true,
      why_choose_us: true, featured_packages: true, testimonials: true, promotional_banners: true,
    }),
    JSON.stringify({
      popularDestinations: ['Bali', 'Dubai', 'Maldives', 'Swiss Alps', 'Paris'],
      experienceCategories: ['International Tours', 'Domestic Tours', 'Adventure Trekking', 'Family Camping', 'Nature & Wildlife', 'Marine Camps', 'Special Services'],
      testimonials: [
        { name: 'Rohit Mehta', location: 'Ahmedabad', text: 'Alpine Explorers crafted the most memorable family camping trip. Safety and comfort were perfect.' },
        { name: 'Priya Shah', location: 'Surat', text: 'The Kedarkantha trek was flawlessly organised — from train travel to snow camps.' },
      ],
      whyChooseUs: ['Since 1998', '25K+ Happy Explorers', 'Presidential Recognition', 'Certified Instructors'],
    })
  )

  /* ── About Us ── */
  db.prepare(`INSERT INTO about_us (id, legacy_description, founder_name, founder_title, founder_bio, founder_image, mission, vision, values_list, recognition, statistics) VALUES (1,?,?,?,?,?,?,?,?,?,?)`).run(
    'Pioneers of adventure tourism in Gujarat, established in 1998 by Amit Lakhani. From the Gulf of Kutch to the high Himalaya, we have crafted nature camps, treks and travel journeys for thousands of explorers.',
    'Amit Lakhani', 'Director', 'Award-winning adventure tourism pioneer and certified mountaineering instructor with honours from the President of India and the Prime Minister of India.',
    null,
    'To make adventure safe, educational and unforgettable for every explorer.',
    'To be India\u2019s most trusted adventure travel company, touching a million journeys.',
    JSON.stringify(['Safety First', 'Integrity', 'Care for Nature', 'Inclusive Adventure', 'Excellence']),
    JSON.stringify([
      { label: 'President Shri K.R. Narayanan', kind: 'Awarded By' },
      { label: 'Prime Minister Shri A.B. Vajpayee', kind: 'Awarded By' },
      { label: 'Nehru Institute of Mountaineering — NIM, Uttarkashi', kind: 'Instructor Association' },
      { label: 'Swami Vivekanand Mountaineering Institute — SVMI, Mount Abu', kind: 'Instructor Association' },
    ]),
    JSON.stringify([
      { label: 'Years of Legacy', value: 28 },
      { label: 'Happy Explorers', value: 25000 },
      { label: 'Treks & Camps', value: 1200 },
      { label: 'Destinations', value: 40 },
    ])
  )

  /* ── Contact Settings ── */
  db.prepare(`INSERT INTO contact_settings (id, company_name, phone, whatsapp, email, address, map_link, instagram, facebook, youtube, business_hours) VALUES (1,?,?,?,?,?,?,?,?,?,?)`).run(
    'Alpine Explorers', '+91 99798 83339', '+91 99798 83339', 'info@alpineexplorers.com',
    'B-309, The One World, Near Ayodhya Chowk, 150 Feet Ring Road, Rajkot - 360 006, Gujarat, India.',
    'https://www.google.com/maps/search/?api=1&query=Ayodhya+Chowk+Rajkot',
    'https://instagram.com', 'https://facebook.com', 'https://youtube.com',
    'Mon – Sat · 10:00 AM to 7:00 PM'
  )

  /* ── Settings ── */
  db.prepare(`INSERT INTO settings (id, website_name, logo, favicon, seo_title, seo_description, ga_id, maintenance_mode) VALUES (1,?,?,?,?,?,?,0)`).run(
    'Alpine Explorers', '', '', 'Alpine Explorers — International & Domestic Tours, Trekking & Camps',
    'Alpine Explorers is a trusted travel and adventure company founded in 1998 — international tours, Himalayan treks, family camping and nature camps.', ''
  )

  /* ── Sample Inquiries ── */
  const inq = db.prepare(`INSERT INTO inquiries (name, email, phone, destination, package_name, travel_date, travelers, message, status) VALUES (?,?,?,?,?,?,?,?,?)`)
  inq.run('Karan Patel', 'karan@example.com', '9876543210', 'Bali', 'Bali', '2026-12-15', 2, 'Interested in a honeymoon package with overwater option.', 'new')
  inq.run('Sneha Desai', 'sneha@example.com', '9876543211', 'Kashmir & Himachal', 'Kashmir & Himachal', '2026-10-01', 4, 'Family tour with kids. Please share itinerary.', 'contacted')
  inq.run('Amit Trivedi', 'amit@example.com', '9876543212', 'Sasan Gir', 'Gir Lion Sanctuary Camp', '2026-11-20', 15, 'School group enquiry for 15 students.', 'in_progress')

  logActivity({ user_name: 'admin', action: 'Database seeded', module: 'Setup', details: 'Initial seed data created' })

  console.log('✓ Database seeded successfully.')
  console.log('  Super Admin → Username: admin | Password: admin123')
  console.log('  Editor      → Username: editor | Password: editor123')
  process.exit(0)
}

main().catch((e) => {
  console.error('Seeding failed:', e)
  process.exit(1)
})