import { db, saveTourPackage } from '../db.js'

export const SEED_TOUR_PACKAGES = [
  // ─────────────────────────────────────────────────────────────
  // 1. THAILAND & BANGKOK (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-thailand',
    match_destination: 'Thailand & Bangkok',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 52000,
    original_price: 68000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bangkok & Transfer to Pattaya',
        description: 'Arrive at Suvarnabhumi Airport in Bangkok, meet our concierge and private transfer to coastal Pattaya. Hotel check-in, evening Alcazar Cabaret Show and Pattaya Beach Road walk.',
        activities: ['Airport Meet & Greet', 'Pattaya Transfer', 'Alcazar Cabaret Show', 'Beach Road Walk'],
        meals: ['Dinner'],
        overnight: 'Pattaya'
      },
      {
        day: 2,
        title: 'Coral Island (Koh Larn) Speedboat Adventure',
        description: 'Speedboat cruise to Coral Island. Enjoy pristine white sand beaches, swimming, parasailing, undersea walking, and an authentic Thai seafood lunch buffet.',
        activities: ['Speedboat Ride', 'Parasailing', 'Snorkeling', 'Undersea Walk'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Pattaya'
      },
      {
        day: 3,
        title: 'Pattaya to Bangkok & Chao Phraya Dinner Cruise',
        description: 'Scenic drive back to Bangkok with a stop at Gems Gallery. Hotel check-in and evening luxury dinner cruise on the Chao Phraya River with illuminated views of Wat Arun and the Grand Palace.',
        activities: ['Gems Gallery Visit', 'Bangkok Transfer', 'Chao Phraya River Cruise', 'Live Thai Classical Dance'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Bangkok'
      },
      {
        day: 4,
        title: 'Bangkok City Temples & Grand Palace',
        description: 'Guided tour of Bangkok’s most revered spiritual sites — Wat Pho (Temple of the Reclining Buddha), Wat Traimit (Golden Buddha Temple), and the majestic Grand Palace complex.',
        activities: ['Wat Pho Temple Tour', 'Wat Traimit Golden Buddha', 'Grand Palace Tour', 'Amulet Market Walk'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Bangkok'
      },
      {
        day: 5,
        title: 'Safari World & Marine Park Excursion',
        description: 'Full-day excursion to Safari World & Marine Park. Experience an open safari drive with zebras and giraffes, followed by thrilling dolphin, sea lion, and stunt shows.',
        activities: ['Open Safari Drive', 'Dolphin Show', 'Marine Park Exploration', 'Spy War Stunt Show'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Bangkok'
      },
      {
        day: 6,
        title: 'Shopping at MBK / Chatuchak & Departure',
        description: 'Morning at leisure for last-minute shopping at MBK Center or CentralWorld. Timely private transfer to Bangkok Suvarnabhumi Airport for your flight back home.',
        activities: ['MBK Shopping', 'Souvenir Hunting', 'Airport Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-thailand',
    match_destination: 'Thailand & Bangkok',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 68000,
    original_price: 88000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bangkok & Transfer to Pattaya',
        description: 'Arrive at Suvarnabhumi Airport, meet our concierge and private transfer to Pattaya. Hotel check-in, evening Alcazar Cabaret Show and Pattaya Beach Road walk.',
        activities: ['Airport Meet & Greet', 'Pattaya Transfer', 'Alcazar Show', 'Beach Road Walk'],
        meals: ['Dinner'],
        overnight: 'Pattaya'
      },
      {
        day: 2,
        title: 'Coral Island (Koh Larn) Speedboat Adventure',
        description: 'Speedboat cruise to Coral Island. Enjoy pristine white sand beaches, swimming, parasailing, undersea walking, and an authentic Thai seafood lunch buffet.',
        activities: ['Speedboat Cruise', 'Parasailing', 'Undersea Walk', 'Seafood Buffet'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Pattaya'
      },
      {
        day: 3,
        title: 'Pattaya to Bangkok & Chao Phraya Dinner Cruise',
        description: 'Drive back to Bangkok. Visit Gems Gallery and transfer to hotel. Evening Chao Phraya River luxury dinner cruise with illuminated views of Wat Arun and the Grand Palace.',
        activities: ['Gems Gallery', 'Bangkok City Transfer', 'Chao Phraya Dinner Cruise'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Bangkok'
      },
      {
        day: 4,
        title: 'Bangkok Temples & Safari World',
        description: 'Visit Wat Pho (Reclining Buddha), Wat Traimit (Golden Buddha), and the Grand Palace. Afternoon at Safari World & Marine Park with dolphin and stunt shows.',
        activities: ['Wat Pho Tour', 'Wat Traimit', 'Safari World Drive', 'Marine Park Shows'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Bangkok'
      },
      {
        day: 5,
        title: 'Fly Bangkok to Phuket & Patong Beach',
        description: 'Morning domestic flight to Phuket. Check-in to tropical beach resort. Evening explore Bangla Road, Patong Night Market, and sunset viewpoints.',
        activities: ['Domestic Flight to Phuket', 'Patong Beach Walk', 'Bangla Road Night Market'],
        meals: ['Breakfast'],
        overnight: 'Phuket'
      },
      {
        day: 6,
        title: 'Phi Phi Islands & Maya Bay Tour',
        description: 'Full-day speedboat excursion to Phi Phi Don, Phi Phi Leh, Maya Bay (The Beach movie fame), Viking Cave, Monkey Beach, and snorkeling in crystal-clear turquoise waters.',
        activities: ['Maya Bay Visit', 'Phi Phi Leh Snorkeling', 'Viking Cave Exploration', 'Monkey Beach'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 7,
        title: 'James Bond Island & Sea Canoeing',
        description: 'Speedboat trip across Phang Nga Bay. Explore James Bond Island (Koh Tapu), limestone caves, mangrove forests, and paddle sea canoes through Koh Panak sea caverns.',
        activities: ['James Bond Island (Koh Tapu)', 'Sea Canoeing', 'Mangrove Forest Cruise', 'Koh Panyee Floating Village'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 8,
        title: 'Phuket Old Town & Airport Departure',
        description: 'Morning visit to Phuket Old Town Sino-Portuguese heritage street and Big Buddha. Afternoon transfer to Phuket International Airport for flight home.',
        activities: ['Phuket Old Town Walk', 'Big Buddha Viewpoint', 'Airport Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. BALI (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-bali',
    match_destination: 'Bali',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 62000,
    original_price: 79000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali & Transfer to Kuta / Seminyak',
        description: 'Arrive at Ngurah Rai International Airport in Denpasar. Traditional Balinese flower garland welcome, private transfer to hotel, and sunset at Kuta Beach.',
        activities: ['Garland Welcome', 'Private Transfer', 'Kuta Beach Sunset Walk'],
        meals: ['Dinner'],
        overnight: 'Kuta / Seminyak'
      },
      {
        day: 2,
        title: 'Ubud Cultural Heart & Tegenungan Waterfall',
        description: 'Journey to artistic Ubud. Explore the sacred Ubud Monkey Forest Sanctuary, marvel at the roaring Tegenungan Waterfall, and stroll through Ubud Art Market.',
        activities: ['Sacred Monkey Forest', 'Tegenungan Waterfall', 'Ubud Art Market', 'Artisan Village Tour'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ubud'
      },
      {
        day: 3,
        title: 'Kintamani Volcano, Coffee Plantation & Rice Terraces',
        description: 'Witness panoramic views of active Mount Batur and Lake Batur from Kintamani. Savor Luwak coffee at an agro-plantation and photograph emerald Tegallalang Rice Terraces.',
        activities: ['Mount Batur Viewpoint', 'Luwak Coffee Tasting', 'Tegallalang Rice Terraces', 'Bali Jungle Swing'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ubud'
      },
      {
        day: 4,
        title: 'Nusa Penida Island Speedboat Day Excursion',
        description: 'High-speed boat to Nusa Penida Island. Visit the iconic T-Rex shaped Kelingking Cliff, Broken Beach natural bridge, Angel’s Billabong infinity pool, and Crystal Bay.',
        activities: ['Speedboat to Nusa Penida', 'Kelingking Secret Point', 'Broken Beach & Angel Billabong', 'Crystal Bay Snorkeling'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Seminyak'
      },
      {
        day: 5,
        title: 'Uluwatu Sunset Temple & Authentic Balinese Spa',
        description: 'Relax with an authentic 2-hour Balinese herbal massage. Afternoon drive to cliff-hanging Uluwatu Temple overlooking the Indian Ocean, followed by sunset Kecak fire dance.',
        activities: ['2-Hour Balinese Spa & Massage', 'Uluwatu Cliff Temple', 'Kecak Fire Dance Performance', 'Jimbaran Seafood Dinner'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Seminyak'
      },
      {
        day: 6,
        title: 'Tanah Lot Temple & Airport Departure',
        description: 'Morning visit to the iconic sea temple of Tanah Lot perched on offshore rock formations. Last-minute souvenir shopping at Krishna Oleh-Oleh before airport drop-off.',
        activities: ['Tanah Lot Temple Visit', 'Krisna Souvenir Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-bali',
    match_destination: 'Bali',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 78000,
    original_price: 99000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Denpasar & Seminyak Beach Sunset',
        description: 'Arrive at Ngurah Rai International Airport. Private transfer to your luxury resort in Seminyak. Evening walk along Seminyak beach and beachfront dinner with live acoustic music.',
        activities: ['Airport VIP Pickup', 'Seminyak Beachfront Walk', 'Welcome Dinner'],
        meals: ['Dinner'],
        overnight: 'Seminyak'
      },
      {
        day: 2,
        title: 'Ubud Monkey Forest & Tegallalang Rice Terraces',
        description: 'Explore Ubud Sacred Monkey Forest Sanctuary, wander through the emerald green Tegallalang rice terraces, experience the iconic Bali jungle swing, and visit Ubud Art Market.',
        activities: ['Sacred Monkey Forest', 'Tegallalang Terraces', 'Bali Jungle Swing', 'Ubud Art Market'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ubud'
      },
      {
        day: 3,
        title: 'Mount Batur Sunrise Trek & Batur Natural Hot Springs',
        description: 'Early morning 4x4 Jeep sunrise excursion to Mount Batur caldera. Soak in Toya Devasya natural geothermal hot springs overlooking Lake Batur, followed by a visit to a Luwak coffee plantation.',
        activities: ['Mount Batur Caldera Sunrise', 'Toya Devasya Hot Springs', 'Luwak Coffee Plantation'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ubud'
      },
      {
        day: 4,
        title: 'Nusa Penida Island Tour — Kelingking & Broken Beach',
        description: 'Fast boat to Nusa Penida. Visit the jaw-dropping Kelingking T-Rex cliff, natural limestone arch at Broken Beach, Angel\'s Billabong tidal pool, and swim at Crystal Bay.',
        activities: ['Speedboat to Nusa Penida', 'Kelingking T-Rex Cliff', 'Broken Beach & Angel Billabong', 'Crystal Bay Swimming'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ubud'
      },
      {
        day: 5,
        title: 'Bedugul, Ulun Danu Beratan & Handara Gate',
        description: 'Journey to Bali\'s central highlands. Photograph the floating Ulun Danu Beratan temple on Lake Beratan, the iconic Handara Golf Gate, and Banyumala twin waterfalls.',
        activities: ['Ulun Danu Beratan Lake Temple', 'Handara Iconic Gate', 'Banyumala Twin Waterfalls', 'Wanagiri Hidden Hills'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuta / Seminyak'
      },
      {
        day: 6,
        title: 'Uluwatu Cliff Temple & Kecak Fire Dance',
        description: 'Afternoon excursion to the dramatic 70-meter limestone sea cliffs of Uluwatu Temple. Watch the hypnotic Kecak & Fire Dance at sunset, followed by a candlelit seafood dinner on Jimbaran Bay.',
        activities: ['Uluwatu Sea Cliff Temple', 'Kecak & Fire Dance', 'Jimbaran Bay Candlelit Seafood Dinner'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kuta / Seminyak'
      },
      {
        day: 7,
        title: 'Seminyak Beach Leisure & Traditional Balinese Spa',
        description: 'Full day at leisure. Relax at world-class beach clubs like Potato Head or Ku De Ta. Indulge in an authentic 2-hour traditional Balinese flower bath and herbal body scrub massage.',
        activities: ['Potato Head / Ku De Ta Beach Club', '2-Hour Balinese Royal Spa', 'Sunset Stroll'],
        meals: ['Breakfast'],
        overnight: 'Kuta / Seminyak'
      },
      {
        day: 8,
        title: 'Tanah Lot Temple & Airport Departure',
        description: 'Morning visit to Tanah Lot, Bali\'s most famous offshore pilgrimage temple. Last-minute souvenir shopping at Krishna Oleh-Oleh before private transfer to Denpasar Airport.',
        activities: ['Tanah Lot Pilgrimage Temple', 'Krisna Souvenir Shopping', 'Airport Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. PHUKET & KRABI (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-phuket-krabi',
    match_destination: 'Phuket & Krabi',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 54000,
    original_price: 70000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Phuket & Patong Beach Exploration',
        description: 'Land at Phuket International Airport. Private air-conditioned transfer to your beach resort. Evening explore Bangla Road, Patong Night Market, and sunset beach walk.',
        activities: ['Airport VIP Transfer', 'Patong Beachfront Stroll', 'Bangla Road Night Market'],
        meals: ['Dinner'],
        overnight: 'Phuket'
      },
      {
        day: 2,
        title: 'Phi Phi Islands & Maya Bay Speedboat Adventure',
        description: 'Speedboat cruise across the Andaman Sea to Phi Phi Don and Phi Phi Leh. Snorkel in crystal lagoons, visit Maya Bay, Viking Cave, and Monkey Beach with Thai buffet lunch.',
        activities: ['Maya Bay Exploration', 'Viking Cave Photography', 'Monkey Beach Visit', 'Coral Reef Snorkeling'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 3,
        title: 'James Bond Island & Phang Nga Bay Canoeing',
        description: 'Excursion through Phang Nga Bay’s towering karst towers. Canoe through hidden sea caves at Koh Panak and visit the famous James Bond Island (Koh Tapu).',
        activities: ['James Bond Island (Koh Tapu)', 'Sea Cave Canoeing', 'Mangrove Forest Safari', 'Floating Village Visit'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 4,
        title: 'Phuket to Krabi Scenic Transfer & Ao Nang Sunset',
        description: 'Scenic overland transfer across dramatic limestone karst valleys to Krabi. Check-in to Ao Nang resort and spend the evening watching the golden sunset from Ao Nang Beach.',
        activities: ['Scenic Krabi Transfer', 'Ao Nang Beach Walk', 'Sunset Beach Dinner'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Krabi'
      },
      {
        day: 5,
        title: 'Krabi 4 Islands Speedboat Tour',
        description: 'Tour Krabi’s celebrated 4 Islands: Koh Poda, Chicken Island, Tup Island with its sandbar, and the sacred Phra Nang Cave Beach. Snorkel among tropical fish.',
        activities: ['Koh Poda Beaching', 'Tup Island Sandbar Walk', 'Chicken Island Snorkeling', 'Phra Nang Cave Beach'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Krabi'
      },
      {
        day: 6,
        title: 'Tiger Cave Temple & Krabi Airport Departure',
        description: 'Morning visit to Krabi Town and the sacred Tiger Cave Temple (Wat Tham Suea) with panoramic jungle views. Transfer to Krabi International Airport for return flight.',
        activities: ['Tiger Cave Temple Visit', 'Krabi Souvenir Market', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-phuket-krabi',
    match_destination: 'Phuket & Krabi',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 72000,
    original_price: 92000,
    itinerary: [
      {
        day: 1,
        title: 'Phuket Arrival & Patong Beach Walk',
        description: 'Arrive at Phuket International Airport, private transfer to your beach resort. Relax, explore the lively Patong Beach area, and enjoy fresh seafood dining along the promenade.',
        activities: ['Airport Meet & Greet', 'Patong Beachfront Walk', 'Seafood Welcome Dinner'],
        meals: ['Dinner'],
        overnight: 'Phuket'
      },
      {
        day: 2,
        title: 'Phi Phi Islands & Maya Bay by Speedboat',
        description: 'Full-day speedboat cruise to Phi Phi Leh, Maya Bay, Viking Cave, Monkey Beach, and snorkeling at Bamboo Island. Buffet lunch on Phi Phi Don included.',
        activities: ['Speedboat to Phi Phi', 'Maya Bay Snorkeling', 'Bamboo Island Visit', 'Viking Cave'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 3,
        title: 'James Bond Island & Phang Nga Bay Sea Canoeing',
        description: 'Speedboat cruise through the dramatic limestone karsts of Phang Nga Bay. Explore Koh Tapu (James Bond Island), sea canoe through hidden sea caverns, and visit the floating Muslim village of Koh Panyee.',
        activities: ['James Bond Island', 'Sea Canoeing in Karst Caverns', 'Koh Panyee Floating Village', 'Mangrove Forest Cruise'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Phuket'
      },
      {
        day: 4,
        title: 'Phuket to Krabi Transfer & Ao Nang Sunset',
        description: 'Scenic drive or ferry crossing from Phuket to Krabi. Hotel check-in in Ao Nang. Evening stroll along Ao Nang beach with stunning views of limestone cliffs at sunset.',
        activities: ['Phuket to Krabi Scenic Transfer', 'Ao Nang Beach Sunset Walk', 'Night Market Shopping'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Krabi'
      },
      {
        day: 5,
        title: 'Krabi 4 Islands Speedboat Tour',
        description: 'Island hopping to Koh Poda, Chicken Island, Tup Island (walk the natural sandbar at low tide), and the famous Phra Nang Cave Beach with rock climbing cliffs.',
        activities: ['Koh Poda White Sands', 'Tup Island Sandbar Walk', 'Chicken Island Snorkeling', 'Phra Nang Cave Beach'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Krabi'
      },
      {
        day: 6,
        title: 'Hong Island Lagoon & Snorkeling Excursion',
        description: 'Speedboat to the breathtaking Hong Islands archipelago. Swim in the secluded emerald lagoon surrounded by vertical limestone walls and snorkel along coral reefs at Koh Lao Lading.',
        activities: ['Hong Island Hidden Lagoon', 'Koh Lao Lading Snorkeling', 'Hong 360 Viewpoint Hike'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Krabi'
      },
      {
        day: 7,
        title: 'Tiger Cave Temple & Emerald Pool (Sa Morakot)',
        description: 'Day trip into Krabi\'s lush rainforest interior. Soak in the natural geothermal Emerald Pool, hot springs waterfall, and climb the Tiger Cave Temple (Wat Tham Suea) for 360-degree valley views.',
        activities: ['Emerald Pool Natural Dip', 'Hot Springs Waterfall Soak', 'Tiger Cave Temple 1260 Steps Climb'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Krabi'
      },
      {
        day: 8,
        title: 'Krabi Souk Shopping & Airport Departure',
        description: 'Morning at leisure for beachside cafe hopping or last-minute souvenir shopping. Private transfer to Krabi International Airport for your departure flight.',
        activities: ['Ao Nang Souvenir Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. SINGAPORE & MALAYSIA (6N/7D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-singapore-malaysia',
    match_destination: 'Singapore & Malaysia',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 0,
    price: 76000,
    original_price: 95000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Singapore & Night Safari Tram Experience',
        description: 'Arrive at Singapore Changi Airport. Transfer to your downtown hotel. Evening visit to the world-renowned Singapore Night Safari with guided open-air tram ride through nocturnal wildlife habitats.',
        activities: ['Changi Airport Arrival', 'Hotel Check-in', 'Night Safari Tram Ride', 'Creatures of the Night Show'],
        meals: ['Dinner'],
        overnight: 'Singapore'
      },
      {
        day: 2,
        title: 'Gardens by the Bay & Marina Bay Sands Skypark',
        description: 'Explore futuristic Gardens by the Bay, marvel at the indoor waterfall in Cloud Forest, walk beneath Supertree Grove, and take in the panoramic Singapore skyline from Marina Bay Sands Observation Deck.',
        activities: ['Flower Dome & Cloud Forest', 'Supertree Grove Walk', 'Marina Bay Sands Skypark', 'Spectra Light & Water Show'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Singapore'
      },
      {
        day: 3,
        title: 'Sentosa Island Cable Car & Universal Studios',
        description: 'Mount Faber scenic Cable Car ride into Sentosa Island. Full day of cinematic thrills at Universal Studios Singapore, followed by Wings of Time multi-sensory laser and fireworks show.',
        activities: ['Singapore Cable Car', 'Universal Studios Theme Park', 'S.E.A. Aquarium Visit', 'Wings of Time Laser Show'],
        meals: ['Breakfast'],
        overnight: 'Singapore'
      },
      {
        day: 4,
        title: 'Singapore to Kuala Lumpur Scenic Cross-Border Journey',
        description: 'Morning drive across the Johor Strait into Malaysia. Scenic expressway ride past lush countryside to capital Kuala Lumpur. Hotel check-in and evening walk around vibrant Bukit Bintang.',
        activities: ['Cross-Border Immigration Transfer', 'Scenic Malaysia Drive', 'Bukit Bintang Street Walk', 'Jalan Alor Street Food'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 5,
        title: 'Kuala Lumpur City Tour & Petronas Twin Towers',
        description: 'Comprehensive city tour of Kuala Lumpur — King’s Palace, National Mosque, Independence Square (Dataran Merdeka), KL Tower Observation Deck, and photo stop at the iconic Petronas Twin Towers.',
        activities: ['Petronas Twin Towers Skybridge', 'KL Tower Observation Deck', 'King’s Palace Photo Stop', 'Independence Square'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 6,
        title: 'Batu Caves & Genting Highlands Mountain Resort',
        description: 'Ascend the 272 rainbow steps at sacred Batu Caves with the giant golden Lord Murugan statue. Board the Awana SkyWay glass-floor cable car up into the misty peaks of Genting Highlands.',
        activities: ['Batu Caves Rainbow Steps', 'Awana SkyWay Cable Car', 'Genting Highlands Resort', 'SkyAvenue Shopping'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 7,
        title: 'Central Market Souvenir Shopping & Departure',
        description: 'Morning visit to historic Central Market (Pasar Seni) and Chinatown Petaling Street for souvenirs and Malaysian white coffee. Private transfer to Kuala Lumpur International Airport.',
        activities: ['Central Market Handicrafts', 'Chinatown Petaling Street', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-singapore-malaysia',
    match_destination: 'Singapore & Malaysia',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 88000,
    original_price: 110000,
    itinerary: [
      {
        day: 1,
        title: 'Singapore Arrival & Night Safari',
        description: 'Arrive at Singapore Changi Airport. Private hotel transfer. Evening visit to the world-first Singapore Night Safari with guided tram ride through 7 geographical zones of nocturnal wildlife.',
        activities: ['Airport Meet & Greet', 'Night Safari Tram Ride', 'Creatures of the Night Show'],
        meals: ['Dinner'],
        overnight: 'Singapore'
      },
      {
        day: 2,
        title: 'Gardens by the Bay & Marina Bay Sands',
        description: 'Marvel at the futuristic Supertree Grove, Flower Dome, and Cloud Forest indoor waterfall. Afternoon at Marina Bay Sands Skypark 57th-floor observation deck with 360-degree Singapore views.',
        activities: ['Flower Dome & Cloud Forest', 'Supertree Grove', 'MBS Skypark Observation Deck', 'Spectra Light & Water Show'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Singapore'
      },
      {
        day: 3,
        title: 'Sentosa Island & Universal Studios',
        description: 'Cable car ride to Sentosa Island. Full day at Universal Studios Singapore experiencing Battlestar Galactica, Transformers 3D, and Jurassic Park. Evening Wings of Time fireworks show.',
        activities: ['Sentosa Cable Car Ride', 'Universal Studios Singapore', 'Wings of Time Laser & Fireworks'],
        meals: ['Breakfast'],
        overnight: 'Singapore'
      },
      {
        day: 4,
        title: 'Singapore to Kuala Lumpur Transfer',
        description: 'Cross-border scenic highway journey across Johor Strait into Malaysia. Arrive in vibrant Kuala Lumpur. Hotel check-in and evening walk around Bukit Bintang shopping and dining boulevard.',
        activities: ['Cross-Border Highway Transfer', 'Bukit Bintang Evening Walk', 'Jalan Alor Street Food Stroll'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 5,
        title: 'KL City Tour & Petronas Twin Towers',
        description: 'City tour covering the King\'s Palace (Istana Negara), Independence Square, National Monument, and the iconic 88-storey Petronas Twin Towers Skybridge and observation deck.',
        activities: ['Petronas Twin Towers Skybridge', 'King\'s Palace Photo Stop', 'National Mosque', 'Independence Square'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 6,
        title: 'Batu Caves & Genting Highlands',
        description: 'Climb the 272 vibrant colored steps to the limestone Batu Caves temple. Ride the scenic Awana SkyWay cable car up into the misty mountaintop entertainment city of Genting Highlands.',
        activities: ['Batu Caves Murugan Statue', 'Awana SkyWay Gondola', 'Genting Highlands Resort World', 'Chin Swee Caves Temple'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 7,
        title: 'UNESCO World Heritage Melaka Day Tour',
        description: 'Full-day excursion to historic Melaka. Visit Dutch Square, Christ Church, A Famosa Portuguese fortress, St. Paul\'s Hill, take a Melaka River Cruise, and explore Jonker Street antique shops.',
        activities: ['Dutch Square & Stadthuys', 'A Famosa Portuguese Fortress', 'Melaka River Cruise', 'Jonker Street Antique Walk'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kuala Lumpur'
      },
      {
        day: 8,
        title: 'Souk Shopping & Airport Departure',
        description: 'Morning at Central Market (Pasar Seni) and Chinatown Petaling Street for souvenirs, batik silk, and Malaysian white coffee. Timely private transfer to KLIA for your return flight.',
        activities: ['Central Market Souvenirs', 'Petaling Street Chinatown', 'KLIA Airport Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 5. SRILANKA (6N/7D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-sri-lanka',
    match_destination: 'Sri Lanka',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 0,
    price: 58000,
    original_price: 75000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Colombo & Transfer to Royal Kandy',
        description: 'Arrive at Bandaranaike International Airport. Meet your personal guide and drive past emerald paddy fields to Kandy, stopping at Pinnawala Elephant Orphanage along the way.',
        activities: ['Airport Concierge Greeting', 'Pinnawala Elephant Orphanage', 'Kandy Scenic Drive', 'Kandyan Cultural Dance Show'],
        meals: ['Dinner'],
        overnight: 'Kandy'
      },
      {
        day: 2,
        title: 'Temple of the Sacred Tooth & Royal Botanical Gardens',
        description: 'Morning visit to Sri Dalada Maligawa (Temple of the Sacred Tooth Relic). Stroll through the lush 147-acre Peradeniya Royal Botanical Gardens featuring 4,000 plant species.',
        activities: ['Temple of the Sacred Tooth Relic', 'Peradeniya Botanical Gardens', 'Kandy Lake Walk', 'Gem Museum Visit'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kandy'
      },
      {
        day: 3,
        title: 'Scenic Hill Country Train to Nuwara Eliya',
        description: 'Board the legendary blue train through misty pine forests and cascading waterfalls to Nuwara Eliya ("Little England"). Tour a working Ceylon tea factory and sample single-origin tea.',
        activities: ['Blue Train Mountain Ride', 'Pedro Tea Estate Factory Tour', 'Nuwara Eliya Colonial Town Walk', 'Gregory Lake Stroll'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Nuwara Eliya'
      },
      {
        day: 4,
        title: 'Ramboda Falls & Scenic Descent to Bentota Beach',
        description: 'Descend through misty mountains past roaring Ramboda Falls and lush rubber plantations to the golden beaches of Bentota on the southwest coast. Relax by the ocean.',
        activities: ['Ramboda Falls Photography', 'Rubber & Spice Garden Tour', 'Bentota Beachfront Check-in'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Bentota'
      },
      {
        day: 5,
        title: 'Madu River Mangrove Boat Safari & Turtle Hatchery',
        description: 'Glide through dense mangrove tunnels on the Madu River boat safari, visit Cinnamon Island, and visit the Kosgoda Sea Turtle Conservation Project to see newborn hatchlings.',
        activities: ['Madu Ganga River Boat Safari', 'Cinnamon Island Peeling Demo', 'Kosgoda Turtle Conservation Centre', 'Water Sports (Jetski/Banana)'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Bentota'
      },
      {
        day: 6,
        title: 'UNESCO Galle Dutch Fort Heritage Walk',
        description: 'Excursion to the 17th-century UNESCO World Heritage Dutch Fort in Galle. Walk along the ramparts, photograph the iconic lighthouse, and browse charming boutique cafes.',
        activities: ['Galle Dutch Fort Walking Tour', 'Galle Lighthouse Photo Stop', 'Maritime Museum', 'Sunset on Ramparts'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Bentota'
      },
      {
        day: 7,
        title: 'Colombo City Tour & Airport Departure',
        description: 'Drive to commercial capital Colombo. Visit Gangaramaya Buddhist Temple, Independence Memorial Hall, and Galle Face Green. Transfer to airport for flight home.',
        activities: ['Gangaramaya Temple Visit', 'Independence Memorial Square', 'Barefoot & Odel Souvenir Shopping', 'Airport Departure Drop'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-sri-lanka',
    match_destination: 'Sri Lanka',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 68000,
    original_price: 88000,
    itinerary: [
      {
        day: 1,
        title: 'Colombo to Kandy via Pinnawala Elephant Sanctuary',
        description: 'Arrive at Colombo Airport. Scenic drive to hill capital Kandy, stopping at Pinnawala Elephant Orphanage to observe river bathing herds. Evening Kandyan cultural dance and firewalking show.',
        activities: ['Pinnawala Elephant Sanctuary', 'Scenic Drive to Kandy', 'Kandyan Cultural Dance Performance'],
        meals: ['Dinner'],
        overnight: 'Kandy'
      },
      {
        day: 2,
        title: 'Temple of the Tooth Relic & Royal Botanical Gardens',
        description: 'Morning homage at the sacred Sri Dalada Maligawa (Temple of the Sacred Tooth). Afternoon stroll through the world-famous Peradeniya Royal Botanical Gardens and Kandy Lake.',
        activities: ['Temple of the Sacred Tooth', 'Peradeniya Botanical Gardens', 'Kandy Lake Walk', 'Gem Museum'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Kandy'
      },
      {
        day: 3,
        title: 'Iconic Scenic Blue Train to Nuwara Eliya',
        description: 'Board the world\'s most scenic highland train ride from Kandy through cloud forests, deep gorges, and tea carpeted hills into Nuwara Eliya ("Little England").',
        activities: ['Highland Blue Train Journey', 'Gregory Lake Walk', 'Colonial Post Office Visit'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Nuwara Eliya'
      },
      {
        day: 4,
        title: 'Tea Plantations, Ramboda Falls & Little Adam\'s Peak',
        description: 'Tour a working British colonial Ceylon tea factory, taste fresh Golden Flowery Pekoe, and hike the gentle trail to Little Adam\'s Peak for breathtaking mountain vistas.',
        activities: ['Tea Estate & Factory Tour', 'Ramboda Falls Photo Stop', 'Little Adam\'s Peak Hike'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Nuwara Eliya'
      },
      {
        day: 5,
        title: 'Nuwara Eliya to Yala National Park Leopard Safari',
        description: 'Drive down from the central highlands to the coastal scrub of Yala. Afternoon 4x4 open-top jeep safari in Yala National Park, holding the world\'s highest density of Sri Lankan leopards.',
        activities: ['Yala 4x4 Jeep Safari', 'Leopard & Wild Elephant Spotting', 'Bird Watching at Waterholes'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Yala'
      },
      {
        day: 6,
        title: 'Yala to UNESCO Galle Fort & Bentota Beach',
        description: 'Drive along the southern coastline past stilt fishermen to the 17th-century UNESCO World Heritage Dutch Fort of Galle. Continue to your beachfront resort in Bentota.',
        activities: ['Stilt Fishermen Photography', 'UNESCO Galle Fort Ramparts Walk', 'Lighthouse & Dutch Churches'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Bentota'
      },
      {
        day: 7,
        title: 'Madu River Mangrove Safari & Water Sports',
        description: 'Riverboat safari through the mangrove labyrinths of the Madu Ganga, stopping at Cinnamon Island and a sea turtle conservation hatchery. Afternoon water sports.',
        activities: ['Madu River Mangrove Boat Safari', 'Cinnamon Island Demo', 'Sea Turtle Conservation Hatchery', 'Bentota Beach Leisure'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Bentota'
      },
      {
        day: 8,
        title: 'Colombo City Highlights & Airport Departure',
        description: 'Morning drive to Colombo. Panoramic city tour covering Gangaramaya Temple, Independence Memorial Hall, Galle Face Green promenade, and transfer to airport.',
        activities: ['Gangaramaya Temple', 'Independence Square', 'Galle Face Green', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 6. VIETNAM (6N/7D & 9N/10D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-vietnam',
    match_destination: 'Vietnam',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 0,
    price: 65000,
    original_price: 84000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi & Old Quarter Cyclo Tour',
        description: 'Arrive at Noi Bai International Airport in Hanoi. Private transfer to hotel. Traditional cyclo ride through the bustling 36 Guild Streets of the French Colonial Old Quarter.',
        activities: ['Airport Meet & Greet', 'French Old Quarter Cyclo Ride', 'Hoan Kiem Lake Sunset Walk'],
        meals: ['Dinner'],
        overnight: 'Hanoi'
      },
      {
        day: 2,
        title: 'Hanoi Heritage Tour & Traditional Water Puppet Show',
        description: 'Visit the Ho Chi Minh Mausoleum complex, One Pillar Pagoda, and Temple of Literature (Vietnam’s first university). Evening traditional Thang Long Water Puppet Theatre performance.',
        activities: ['Ho Chi Minh Mausoleum', 'One Pillar Pagoda', 'Temple of Literature', 'Water Puppet Theatre Performance'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Hanoi'
      },
      {
        day: 3,
        title: 'Hanoi to Halong Bay Overnight Luxury Cruise',
        description: 'Drive through Red River Delta to Halong Bay. Board a 5-star wooden junk cruise, sail past thousands of towering limestone karsts, kayak through Sung Sot Cave, and enjoy sunset on deck.',
        activities: ['Board Luxury Cruise', 'Sung Sot Cave Exploration', 'Kayaking in Ti Top Island', 'Cooking Demonstration on Deck'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Halong Bay Cruise'
      },
      {
        day: 4,
        title: 'Halong Sunrise Tai Chi & Flight to Da Nang',
        description: 'Sunrise Tai Chi on the sun deck, visit Luon Cave by bamboo boat, and cruise back to harbor. Transfer to Hanoi airport for a short domestic flight to coastal Da Nang / Hoi An.',
        activities: ['Sunrise Tai Chi', 'Luon Cave Bamboo Boat', 'Domestic Flight to Da Nang', 'Hoi An Ancient Town Night Walk'],
        meals: ['Breakfast', 'Brunch'],
        overnight: 'Hoi An'
      },
      {
        day: 5,
        title: 'Ba Na Hills & Iconic Golden Giant Hand Bridge',
        description: 'Ascend Ba Na Hills on the world-record cable car. Walk across the stunning Golden Bridge held by colossal stone hands, visit French Village, and explore Fantasy Park.',
        activities: ['Golden Bridge Walk', 'World Record Cable Car', 'French Village Exploration', 'Linh Ung Pagoda'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Hoi An'
      },
      {
        day: 6,
        title: 'Hoi An Lantern Town & Basket Boat Water Coconut Forest',
        description: 'Ride round bamboo basket boats through Bay Mau Water Coconut Forest, followed by a guided walking tour of UNESCO Hoi An — Japanese Covered Bridge, Chinese Assembly Halls, and lantern release.',
        activities: ['Bay Mau Basket Boat Spin', 'Japanese Covered Bridge Tour', 'Lantern Release on Thu Bon River', 'Night Market'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Hoi An'
      },
      {
        day: 7,
        title: 'Marble Mountains & Da Nang Departure',
        description: 'Morning visit to Marble Mountains with limestone caves and Buddhist sanctuaries. Transfer to Da Nang International Airport for your return flight.',
        activities: ['Marble Mountains Cave Exploration', 'Non Nuoc Stone Carving Village', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-vietnam',
    match_destination: 'Vietnam',
    duration: '9N/10D',
    days: 10,
    nights: 9,
    is_default: 1,
    price: 94000,
    original_price: 119000,
    itinerary: [
      {
        day: 1,
        title: 'Hanoi Arrival & Old Quarter Street Food Walk',
        description: 'Arrive at Noi Bai International Airport. Private hotel transfer. Evening cyclo ride through the bustling 36 Guild Streets of the Old Quarter, tasting world-famous egg coffee and pho.',
        activities: ['Airport Meet & Greet', 'Old Quarter Cyclo Ride', 'Egg Coffee & Street Food Tasting'],
        meals: ['Dinner'],
        overnight: 'Hanoi'
      },
      {
        day: 2,
        title: 'Hanoi City Highlights & Water Puppet Theatre',
        description: 'Visit the Ho Chi Minh Mausoleum complex, One Pillar Pagoda, Temple of Literature (founded 1070), and serene Hoan Kiem Lake. Evening Thang Long Water Puppet Theatre performance.',
        activities: ['Ho Chi Minh Mausoleum', 'One Pillar Pagoda', 'Temple of Literature', 'Thang Long Water Puppet Show'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Hanoi'
      },
      {
        day: 3,
        title: 'Hanoi to Ha Long Bay 5-Star Cruise',
        description: 'Scenic transfer to Ha Long Bay. Board your luxury cruise vessel. Sail through thousands of towering limestone karsts, kayak around Luon Cave, and visit Sung Sot (Surprise) Cave.',
        activities: ['Ha Long Bay Luxury Cruise', 'Sung Sot Cave Walk', 'Sea Kayaking', 'Sunset Squid Fishing'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Ha Long Bay Cruise'
      },
      {
        day: 4,
        title: 'Ha Long Bay Sunrise Tai Chi & Fly to Da Nang',
        description: 'Morning Tai Chi on the sun deck as mist lifts off the bay. Cruise past iconic islet formations. Disembark and transfer to Hanoi Airport for your flight to the coastal city of Da Nang.',
        activities: ['Sunrise Tai Chi on Deck', 'Ti Top Island Hike', 'Domestic Flight to Da Nang'],
        meals: ['Breakfast', 'Brunch'],
        overnight: 'Da Nang / Hoi An'
      },
      {
        day: 5,
        title: 'Ba Na Hills & The Iconic Golden Bridge',
        description: 'Ride the world\'s longest non-stop cable car up to Sun World Ba Na Hills. Walk across the world-famous Golden Bridge supported by giant stone hands, and explore the French Village.',
        activities: ['Golden Bridge Giant Hands Walk', 'Cable Car Mountain Ascent', 'French Village & Fantasy Park'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Da Nang / Hoi An'
      },
      {
        day: 6,
        title: 'UNESCO Hoi An Lantern Town & Basket Boat Eco Tour',
        description: 'Morning bamboo basket boat ride through Bay Mau Coconut Forest with local fishermen. Afternoon guided walking tour of UNESCO Hoi An Ancient Town and release silk lanterns onto the river.',
        activities: ['Bay Mau Coconut Basket Boat', 'Japanese Covered Bridge', 'Tan Ky Ancient House', 'Evening Lantern Release'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Hoi An'
      },
      {
        day: 7,
        title: 'Fly Da Nang to Ho Chi Minh City (Saigon)',
        description: 'Short morning flight to vibrant Ho Chi Minh City. Visit the War Remnants Museum, Reunification Palace, Notre Dame Cathedral Basilica, and the historic French Central Post Office.',
        activities: ['Domestic Flight to Saigon', 'War Remnants Museum', 'Reunification Palace', 'Notre Dame Cathedral'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Ho Chi Minh City'
      },
      {
        day: 8,
        title: 'Historic Cu Chi Tunnels Underground Network',
        description: 'Morning excursion to the legendary Cu Chi Tunnels. Crawl through sections of the 250km subterranean tunnel network used during the war, see booby traps, and learn guerrilla warfare history.',
        activities: ['Cu Chi Tunnels Exploration', 'Underground Bunker Walk', 'Firing Range Demo (optional)'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ho Chi Minh City'
      },
      {
        day: 9,
        title: 'Mekong Delta River Safari & Floating Life',
        description: 'Full-day excursion to My Tho in the fertile Mekong Delta. Cruise the mighty Mekong River by motorboat, row through coconut palm canals, visit honeybee farms, and taste tropical fruits.',
        activities: ['Mekong River Boat Cruise', 'Rowing Sampan through Canals', 'Honeybee Farm & Coconut Candy Workshop'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Ho Chi Minh City'
      },
      {
        day: 10,
        title: 'Ben Thanh Market & Airport Departure',
        description: 'Morning souvenir shopping for Vietnamese coffee, silk, and ceramics at iconic Ben Thanh Market. Timely private transfer to Tan Son Nhat Airport for your return flight.',
        activities: ['Ben Thanh Market Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 7. BAKU (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-baku',
    match_destination: 'Baku',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 59000,
    original_price: 76000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Baku & Seaside Boulevard Walk',
        description: 'Arrive at Heydar Aliyev International Airport. Private transfer to your luxury hotel. Evening stroll along the Caspian Seaside Boulevard and panoramic views of illuminated Flame Towers.',
        activities: ['Airport VIP Transfer', 'Caspian Boulevard Stroll', 'Flame Towers Night Lighting'],
        meals: ['Dinner'],
        overnight: 'Baku'
      },
      {
        day: 2,
        title: 'Baku Old City (Icherisheher) & Shirvanshah Palace',
        description: 'Explore the 12th-century UNESCO Old City of Baku. Visit the legendary Maiden Tower, the grand Palace of the Shirvanshahs, ancient Caravanserais, and Miniature Book Museum.',
        activities: ['Maiden Tower Climb', 'Shirvanshah Palace Tour', 'Miniature Book Museum', 'Fountain Square Stroll'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 3,
        title: 'Gobustan National Park & Active Mud Volcanoes',
        description: 'Excursion to Gobustan National Park to admire 40,000-year-old rock petroglyphs. Journey in Soviet Lada cars to the bubbling alien landscape of active mud volcanoes.',
        activities: ['Gobustan Rock Art Petroglyphs', 'Mud Volcanoes 4x4 Experience', 'Bibi-Heybat Mosque Visit'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 4,
        title: 'Ateshgah Fire Temple, Yanardag & Heydar Aliyev Center',
        description: 'Visit the ancient Zoroastrian Fire Temple of Ateshgah, marvel at Yanardag (Burning Mountain) where natural gas has burned for millennia, and admire Zaha Hadid’s architectural masterpiece.',
        activities: ['Ateshgah Zoroastrian Fire Temple', 'Yanardag Burning Mountain', 'Heydar Aliyev Center Photography'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 5,
        title: 'Highland Park, Funicular & Nizami Street Shopping',
        description: 'Ride the Baku Funicular to Highland Park for sweeping views over Baku Bay. Spend the afternoon browsing European boutiques, caviar stores, and cafes along pedestrian Nizami Street.',
        activities: ['Baku Funicular Ride', 'Highland Park Panoramic View', 'Nizami Street Shopping', 'Carpet Museum Visit'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Baku'
      },
      {
        day: 6,
        title: 'Yashil Bazaar Local Flavors & Airport Departure',
        description: 'Morning visit to the colorful Yashil Bazaar (Green Market) for dried fruits, nuts, Azeri tea, and Caspian caviar. Transfer to airport for flight home.',
        activities: ['Yashil Green Market Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-baku',
    match_destination: 'Baku',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 74000,
    original_price: 94000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Baku & Seaside Boulevard Walk',
        description: 'Arrive at Heydar Aliyev International Airport. Private hotel transfer. Evening walk along the Caspian Seaside Boulevard and view the dazzling Flame Towers LED illumination show.',
        activities: ['Airport Meet & Greet', 'Caspian Boulevard Walk', 'Flame Towers LED Show'],
        meals: ['Dinner'],
        overnight: 'Baku'
      },
      {
        day: 2,
        title: 'Baku Old City (Icherisheher) & Shirvanshah Palace',
        description: 'Guided tour of the 12th-century UNESCO Old City. Climb the enigmatic Maiden Tower, explore the grand Shirvanshah Palace complex, and see the Museum of Miniature Books.',
        activities: ['Maiden Tower', 'Shirvanshah Palace', 'Miniature Book Museum', 'Fountain Square'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 3,
        title: 'Gobustan Mud Volcanoes & Ancient Petroglyphs',
        description: 'Explore UNESCO Gobustan National Park with 40,000-year-old rock engravings. Ride vintage Lada cars to bubbling mud volcanoes and visit the stunning Bibi-Heybat Mosque.',
        activities: ['Gobustan Petroglyphs', 'Mud Volcanoes 4x4 Tour', 'Bibi-Heybat Mosque'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 4,
        title: 'Ateshgah Fire Temple, Yanardag & Heydar Aliyev Centre',
        description: 'Visit the 17th-century Ateshgah Zoroastrian Fire Temple and Yanardag (Burning Mountain), where natural gas burns eternally. Photo stop at Zaha Hadid\'s iconic Heydar Aliyev Centre.',
        activities: ['Ateshgah Fire Temple', 'Yanardag Burning Mountain', 'Heydar Aliyev Centre Architecture'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 5,
        title: 'Day Trip to Gabala Mountain Resort & Nohur Lake',
        description: 'Full-day excursion into the Caucasus Mountains to Gabala. Visit the emerald green Nohur Lake surrounded by forests, and ride the Tufandag Mountain Ropeway cable car.',
        activities: ['Scenic Caucasus Mountains Drive', 'Nohur Lake Boat Ride', 'Tufandag Ropeway Cable Car'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Gabala / Baku'
      },
      {
        day: 6,
        title: 'Shamakhi Juma Mosque & Diri Baba Mausoleum',
        description: 'Visit the ancient city of Shamakhi, home to the magnificent 8th-century Juma Mosque. Stop at the two-story Diri Baba rock-cut mausoleum nestled inside a cliff face.',
        activities: ['Shamakhi Juma Mosque', 'Diri Baba Cliff Mausoleum', 'Wine & Local Cheese Tasting'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Baku'
      },
      {
        day: 7,
        title: 'Highland Park, Carpet Museum & Nizami Street',
        description: 'Ride the funicular to Highland Park for panoramic views across Baku Bay. Visit the Azerbaijan Carpet Museum shaped like a rolled carpet, and shop along pedestrian Nizami Street.',
        activities: ['Highland Park Panoramic View', 'Azerbaijan Carpet Museum', 'Nizami Street Shopping'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Baku'
      },
      {
        day: 8,
        title: 'Yashil Bazaar Local Market & Airport Departure',
        description: 'Visit Yashil Bazaar (Green Market) to purchase saffron, caviar, dried persimmons, and Azerbaijani tea. Timely private transfer to Baku Airport for your return flight.',
        activities: ['Yashil Bazaar Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 8. BHUTAN (6N/7D & 9N/10D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-bhutan',
    match_destination: 'Bhutan',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 0,
    price: 82000,
    original_price: 105000,
    itinerary: [
      {
        day: 1,
        title: 'Spectacular Flight to Paro & Drive to Thimphu',
        description: 'Scenic flight over the Himalayas into Paro Valley with views of Everest and Kanchenjunga. Traditional Tashi Delek welcome, followed by a scenic 1.5-hour drive to capital Thimphu.',
        activities: ['Himalayan Mountain Flight', 'Paro Airport Welcome', 'Scenic Thimphu Drive', 'Tashichho Dzong Evening View'],
        meals: ['Lunch', 'Dinner'],
        overnight: 'Thimphu'
      },
      {
        day: 2,
        title: 'Thimphu Cultural Treasures & Buddha Dordenma',
        description: 'Marvel at the gigantic 169-foot bronze Buddha Dordenma overlooking Thimphu valley. Visit the National Memorial Chorten, Motithang Takin Preserve, and National Textile Museum.',
        activities: ['Buddha Dordenma (Giant Buddha)', 'National Memorial Chorten', 'Takin Wildlife Preserve', 'Centenary Farmers Market'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Thimphu'
      },
      {
        day: 3,
        title: 'Dochula Pass (108 Chortens) to Subtropical Punakha',
        description: 'Drive across Dochula Pass (3,100m) with panoramic Himalayan peak views and 108 memorial stupas. Descend into the warm valley of Punakha and visit Chimi Lhakhang (Fertility Temple).',
        activities: ['Dochula Pass 108 Chortens', 'Himalayan Panorama View', 'Chimi Lhakhang Village Walk'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Punakha'
      },
      {
        day: 4,
        title: 'Majestic Punakha Dzong & Long Suspension Bridge',
        description: 'Tour the grand 17th-century Punakha Dzong, situated at the confluence of the Pho Chhu and Mo Chhu rivers. Walk across the 160-meter Punakha Suspension Bridge and return to Paro.',
        activities: ['Punakha Dzong Architectural Tour', 'Punakha Suspension Bridge Walk', 'Scenic Drive to Paro'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 5,
        title: 'Hike to Legendary Tiger’s Nest (Paro Taktsang)',
        description: 'Epic pilgrimage hike to Paro Taktsang (Tiger’s Nest Monastery), clinging dramatically to a vertical granite cliff 900 meters above the valley floor. An unforgettable spiritual experience.',
        activities: ['Tiger’s Nest Monastery Pilgrimage', 'Cafeteria Viewpoint Tea', 'Prayer Flag Blessings'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 6,
        title: 'Kyichu Lhakhang & Traditional Hot Stone Bath',
        description: 'Visit 7th-century Kyichu Lhakhang, one of Bhutan’s oldest temples. Tour the National Museum of Bhutan (Ta Dzong) and unwind with a therapeutic wooden tub hot stone bath.',
        activities: ['Kyichu Lhakhang Temple Visit', 'Ta Dzong National Museum', 'Traditional Dotsho Hot Stone Bath'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 7,
        title: 'Tashi Delek & Paro Airport Departure',
        description: 'Farewell breakfast with your guide and driver. Transfer to Paro International Airport for your breathtaking departure flight over the Himalayan peaks.',
        activities: ['Farewell Khata Ceremony', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-bhutan',
    match_destination: 'Bhutan',
    duration: '9N/10D',
    days: 10,
    nights: 9,
    is_default: 1,
    price: 115000,
    original_price: 145000,
    itinerary: [
      {
        day: 1,
        title: 'Fly to Paro & Scenic Drive to Thimphu',
        description: 'Breathtaking flight into Paro Valley with Himalayan peak views. Meet your guide and scenic drive to capital Thimphu. Evening visit to Tashichho Dzong fortress and central clock tower.',
        activities: ['Himalayan Flight into Paro', 'Scenic Drive to Thimphu', 'Tashichho Dzong Fortress Walk'],
        meals: ['Lunch', 'Dinner'],
        overnight: 'Thimphu'
      },
      {
        day: 2,
        title: 'Thimphu Valley Cultural Tour & Giant Buddha',
        description: 'Visit the colossal 51-meter bronze Buddha Dordenma, National Memorial Chorten, Motithang Takin Preserve (Bhutan\'s national animal), and the Traditional Painting School (Zorig Chusum).',
        activities: ['Buddha Dordenma', 'National Memorial Chorten', 'Takin Sanctuary', 'School of 13 Arts & Crafts'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Thimphu'
      },
      {
        day: 3,
        title: 'Dochula Pass (108 Chortens) to Punakha',
        description: 'Drive across the 3,100-meter Dochula Pass with 108 Druk Wangyal Chortens and panoramic Himalayan views. Descend into the subtropical Punakha valley and visit Chimi Lhakhang.',
        activities: ['Dochula Pass 108 Memorial Chortens', 'Himalayan Range Viewpoint', 'Chimi Lhakhang Fertility Temple'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Punakha'
      },
      {
        day: 4,
        title: 'Majestic Punakha Dzong & Long Suspension Bridge',
        description: 'Explore the stunning 17th-century Punakha Dzong situated at the confluence of Pho Chhu and Mo Chhu rivers. Walk across Bhutan\'s longest suspension bridge draped in prayer flags.',
        activities: ['Punakha Dzong Tour', 'Long Suspension Bridge Walk', 'Khamsum Yulley Namgyal Chorten Hike'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Punakha'
      },
      {
        day: 5,
        title: 'Punakha to Phobjikha Glacial Valley',
        description: 'Drive to the pristine high-altitude glacial valley of Phobjikha. Visit the 17th-century Gangtey Monastery and walk the scenic Gangtey Nature Trail through flower-filled meadows.',
        activities: ['Gangtey Monastery', 'Gangtey Nature Trail Walk', 'Black-Necked Crane Information Centre'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Phobjikha'
      },
      {
        day: 6,
        title: 'Phobjikha to Paro Valley via Wangdue',
        description: 'Scenic return drive across high mountain passes back to Paro valley. Stop at historic Wangdue Phodrang Dzong and enjoy an evening walk around Paro town\'s traditional handicraft shops.',
        activities: ['Wangdue Phodrang Dzong', 'Scenic Highway Return Drive', 'Paro Town Handicraft Walk'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 7,
        title: 'Iconic Hike to Tiger\'s Nest (Paro Taktsang)',
        description: 'The pinnacle experience of Bhutan — a pilgrimage hike ascending through pine forests to the cliff-hanging Paro Taktsang monastery, perched 900 meters above the valley floor.',
        activities: ['Tiger\'s Nest Monastery Hike', 'Cliffside Cafeteria Lunch', 'Butter Lamp Lighting Ceremony'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 8,
        title: 'Chele La Pass (Highest Motorroad) & Haa Valley',
        description: 'Drive over Chele La Pass at 3,988 meters with prayer flag forests and views of sacred Mt. Jomolhari. Explore the remote, untouched Haa Valley and its ancient White and Black Temples.',
        activities: ['Chele La Pass 3988m', 'Lhakhang Karpo (White Temple)', 'Lhakhang Nagpo (Black Temple)', 'Traditional Farmhouse Lunch'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 9,
        title: 'Paro National Museum & Traditional Hot Stone Bath',
        description: 'Visit the National Museum of Bhutan (Ta Dzong) and Rinpung Dzong fortress. In the afternoon, relax with an authentic Bhutanese herbal hot stone bath heated by river stones.',
        activities: ['Ta Dzong National Museum', 'Rinpung Dzong Fortress', 'Traditional Herbal Hot Stone Bath (Dotsho)'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Paro'
      },
      {
        day: 10,
        title: 'Tashi Delek & Paro Airport Departure',
        description: 'Farewell breakfast with your guide and driver. Traditional Khata scarf presentation ceremony, followed by private transfer to Paro International Airport for departure.',
        activities: ['Traditional Khata Farewell', 'Paro Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 9. GOA (6N/7D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-goa',
    match_destination: 'Goa',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 1,
    price: 38000,
    original_price: 52000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa & North Goa Beach Sunset',
        description: 'Arrive at Goa Dabolim / Mopa International Airport. Private air-conditioned transfer to your beach resort in North Goa. Evening walk on Calangute beach and welcome beach shack dinner.',
        activities: ['Airport Meet & Greet', 'Resort Check-in', 'Calangute Beach Walk', 'Beach Shack Dinner'],
        meals: ['Dinner'],
        overnight: 'North Goa'
      },
      {
        day: 2,
        title: 'North Goa Forts & Coastal Beaches',
        description: 'Explore 17th-century Portuguese Fort Aguada and its historic lighthouse. Continue to Sinquerim, Candolim, Baga beach, and enjoy golden hour cliff views at Chapora Fort (Dil Chahta Hai fame).',
        activities: ['Fort Aguada & Lighthouse', 'Chapora Fort Cliff Views', 'Baga Beach Stroll', 'Anjuna Sunset'],
        meals: ['Breakfast'],
        overnight: 'North Goa'
      },
      {
        day: 3,
        title: 'High-Speed Water Sports & Mandovi River Cruise',
        description: 'Thrilling water sports at Baga Beach: parasailing, jet-ski ride, banana boat, and bumper ride. Evening Mandovi River cruise with live Goan folk music, Dekhni dance, and DJ.',
        activities: ['Parasailing & Jet Ski', 'Banana Boat Ride', 'Mandovi River Luxury Cruise', 'Goan Folk Performance'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'North Goa'
      },
      {
        day: 4,
        title: 'South Goa Heritage Churches & Latin Quarter',
        description: 'Explore UNESCO World Heritage Old Goa churches — Basilica of Bom Jesus (relics of St. Francis Xavier) and Se Cathedral. Stroll through the colorful Portuguese Latin Quarter of Fontainhas in Panjim.',
        activities: ['Basilica of Bom Jesus', 'Se Cathedral', 'Fontainhas Latin Quarter Walking Tour', 'Miramar Beach'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'South Goa'
      },
      {
        day: 5,
        title: 'Dudhsagar Waterfalls & Organic Spice Plantation',
        description: 'Full-day open-jeep safari through the Western Ghats jungle to multi-tiered Dudhsagar Waterfalls. Natural pool swim, followed by a guided tour and buffet lunch at an organic spice plantation.',
        activities: ['Dudhsagar Jeep Safari', 'Waterfall Lagoon Swim', 'Spice Plantation Guided Tour', 'Traditional Goan Buffet'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'South Goa'
      },
      {
        day: 6,
        title: 'Pristine South Goa Beaches (Palolem & Cola)',
        description: 'Full-day excursion to serene South Goa. Relax at crescent-shaped Palolem beach, take a boat ride to Butterfly Beach, and unwind beside Cola Beach\'s emerald freshwater lagoon.',
        activities: ['Palolem Crescent Beach', 'Butterfly Beach Boat Ride', 'Cola Beach Lagoon', 'Sunset Cocktail'],
        meals: ['Breakfast'],
        overnight: 'South Goa'
      },
      {
        day: 7,
        title: 'Panjim Market Shopping & Airport Departure',
        description: 'Morning shopping in Panjim for Goan feni, cashew nuts, port wine, and spices. Timely private transfer to the airport for your flight back home.',
        activities: ['Panjim Municipal Market Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-goa',
    match_destination: 'Goa',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 0,
    price: 45000,
    original_price: 60000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa & Check-in at Beachfront Resort',
        description: 'Arrive at Goa Airport. Private transfer to your luxury beachfront resort. Welcome drink, relax by the pool, and enjoy an evening sunset stroll along Candolim beach.',
        activities: ['Airport VIP Transfer', 'Candolim Beach Sunset', 'Beachside Welcome Dinner'],
        meals: ['Dinner'],
        overnight: 'North Goa'
      },
      {
        day: 2,
        title: 'North Goa Coastal Trail — Fort Aguada & Vagator',
        description: 'Visit the historic 17th-century Fort Aguada, Candolim lighthouse, and the rocky red cliffs of Vagator Beach. Afternoon visit to famous Chapora Fort.',
        activities: ['Fort Aguada & Lighthouse', 'Vagator Beach Red Cliffs', 'Chapora Fort Sunset'],
        meals: ['Breakfast'],
        overnight: 'North Goa'
      },
      {
        day: 3,
        title: 'High-Octane Water Sports & Mandovi River Cruise',
        description: 'Action-packed water sports package at Calangute/Baga: parasailing, jet-skiing, bumper ride, and speedboating. Evening luxury Mandovi river cruise with live DJ and Goan folk dance.',
        activities: ['Parasailing with Dip', 'Jet Ski Ride', 'Bumper Ride', 'Mandovi River Sunset Cruise'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'North Goa'
      },
      {
        day: 4,
        title: 'South Goa Historic Churches & Fontainhas Latin Quarter',
        description: 'UNESCO World Heritage sites in Old Goa — Basilica of Bom Jesus, Se Cathedral, Church of St. Francis of Assisi. Stroll through the pastel Portuguese villas of Fontainhas in Panaji.',
        activities: ['Basilica of Bom Jesus', 'Se Cathedral', 'Fontainhas Heritage Walk', 'Miramar Beach Sunset'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'South Goa'
      },
      {
        day: 5,
        title: 'Dudhsagar Waterfalls Jeep Safari & Spice Plantation',
        description: 'Jeep safari through Bhagwan Mahavir Wildlife Sanctuary to the roaring multi-tiered Dudhsagar Waterfalls. Swim in natural pools, followed by authentic Goan lunch at Sahakari Spice Farm.',
        activities: ['4x4 Jungle Jeep Safari', 'Dudhsagar Waterfall Swim', 'Spice Farm Guided Tour', 'Traditional Banana Leaf Lunch'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'South Goa'
      },
      {
        day: 6,
        title: 'Palolem & Butterfly Beach Cruise in South Goa',
        description: 'Discover the tranquil paradise of South Goa. Relax at Palolem Beach, take a boat cruise to spot dolphins around Butterfly Beach, and visit pristine Agonda beach.',
        activities: ['Palolem Beach Day', 'Dolphin Spotting Boat Trip', 'Butterfly Beach Visit', 'Agonda Sunset Walk'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'South Goa'
      },
      {
        day: 7,
        title: 'Anjuna Flea Market & Curated Nightlife Experience',
        description: 'Morning visit to the iconic Anjuna Flea Market / Arpora Saturday Night Market. Relax at stylish beachfront clubs (Curlies / Thalassa) with Greek cuisine and sunset vibes.',
        activities: ['Anjuna Flea Market Shopping', 'Thalassa Sunset Cliff Experience', 'Tito\'s Lane Nightlife'],
        meals: ['Breakfast'],
        overnight: 'North Goa'
      },
      {
        day: 8,
        title: 'Panjim Souvenir Shopping & Airport Departure',
        description: 'Morning at leisure for last-minute shopping for Goan cashews, artisanal feni, and Mario Miranda caricatures. Private transfer to airport for your flight home.',
        activities: ['Panjim Municipal Market', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 10. KASHMIR & HIMACHAL (6N/7D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-kashmir-himachal',
    match_destination: 'Kashmir & Himachal',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 0,
    price: 49000,
    original_price: 66000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar, Houseboat Check-in & Shikara Ride',
        description: 'Arrive at Srinagar Sheikh ul-Alam Airport. Traditional Kashmiri welcome and transfer to your luxury carved cedar houseboat on Dal Lake. Sunset Shikara ride visiting Char Chinar and floating gardens.',
        activities: ['Srinagar Airport Meet & Greet', 'Luxury Houseboat Check-in', 'Sunset Dal Lake Shikara Ride', 'Floating Flower Market'],
        meals: ['Dinner'],
        overnight: 'Srinagar (Houseboat)'
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg Meadow of Flowers & Gondola Ride',
        description: 'Drive through pine forests to Gulmarg (2,650m). Board the Gulmarg Gondola (world’s highest cable car) up to Phase 1 Kongdoori for snow activities and panoramic views of Apharwat Peak.',
        activities: ['Gulmarg Valley Drive', 'Gondola Ride Phase 1', 'Snow Sledge / Skiing Activity', 'Golf Course Walk'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Gulmarg'
      },
      {
        day: 3,
        title: 'Gulmarg to Pahalgam Valley of Shepherds',
        description: 'Scenic drive to Pahalgam along the roaring Lidder River, passing saffron fields of Pampore and Awantipora temple ruins. Relax in the pine-scented alpine valley.',
        activities: ['Pampore Saffron Fields Stop', 'Awantipora Ruins', 'Lidder River Walk', 'Pahalgam Market'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pahalgam'
      },
      {
        day: 4,
        title: 'Betaab Valley, Aru Valley & Drive to Dharamshala',
        description: 'Pony ride or local taxi to picturesque Betaab Valley and Aru Valley. Scenic drive through the Pir Panjal mountain range toward Himachal Pradesh, reaching Dharamshala.',
        activities: ['Betaab Valley Exploration', 'Aru Valley Alpine Meadows', 'Scenic Mountain Drive to Himachal'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Dharamshala'
      },
      {
        day: 5,
        title: 'McLeod Ganj Dalai Lama Temple & Drive to Manali',
        description: 'Visit the spiritual Tsuglagkhang Complex (residence of the Dalai Lama), serene Bhagsunag Waterfall, and St. John in the Wilderness church. Continue scenic drive to Manali.',
        activities: ['Dalai Lama Temple', 'Bhagsunag Waterfall', 'Kullu Shawl Factory Stop', 'Scenic Beas River Drive'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Manali'
      },
      {
        day: 6,
        title: 'Solang Valley Adventure & Atal Tunnel Excursion',
        description: 'Adventure day at Solang Valley: paragliding, zorbing, and quad biking. Drive through the engineering marvel Atal Tunnel into the breathtaking landscape of Lahaul Valley.',
        activities: ['Solang Valley Paragliding', 'Atal Tunnel Drive', 'Sissu Waterfall Viewpoint', 'Manali Mall Road Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Manali'
      },
      {
        day: 7,
        title: 'Hadimba Temple & Chandigarh / Delhi Departure',
        description: 'Morning visit to the 450-year-old wooden Hadimba Devi Temple nestled in ancient deodar cedar forests. Timely transfer to Chandigarh / Delhi airport for return flight.',
        activities: ['Hadimba Devi Temple Visit', 'Vashisht Hot Springs Stop', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-kashmir-himachal',
    match_destination: 'Kashmir & Himachal',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 58000,
    original_price: 76000,
    itinerary: [
      {
        day: 1,
        title: 'Srinagar Arrival & Dal Lake Shikara Ride',
        description: 'Arrive at Srinagar Sheikh ul-Alam Airport. Traditional Kashmiri welcome and transfer to your luxury carved cedar houseboat on Dal Lake. Sunset Shikara ride visiting Char Chinar and floating flower gardens.',
        activities: ['Airport Meet & Greet', 'Houseboat Check-in', 'Sunset Dal Lake Shikara Ride', 'Char Chinar Island'],
        meals: ['Dinner'],
        overnight: 'Srinagar (Houseboat)'
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg Gondola Ride',
        description: 'Scenic 2-hour drive to Gulmarg (Meadow of Flowers). Board the world\'s second-highest operating cable car — Gulmarg Gondola Phase 1 to Kongdoori and Phase 2 to Apharwat Peak (3,980m) for snow activities.',
        activities: ['Gulmarg Gondola Phase 1 & 2', 'Snow Sledging & Skiing', 'Apharwat Peak Snow Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Gulmarg'
      },
      {
        day: 3,
        title: 'Srinagar to Pahalgam Valley of Shepherds',
        description: 'Drive along the Lidder River past saffron fields at Pampore and cricket bat factories at Sangam. Arrive in Pahalgam (2,130m). Visit Betaab Valley, Chandanwari, and Aru Valley by local union vehicle.',
        activities: ['Saffron Fields Stop', 'Betaab Valley', 'Aru Valley Alpine Meadow', 'Lidder River Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pahalgam'
      },
      {
        day: 4,
        title: 'Pahalgam to Srinagar Mughal Gardens',
        description: 'Return to Srinagar. Visit the magnificent terraced Persian Mughal Gardens built by Emperor Jahangir: Nishat Bagh (Garden of Pleasure), Shalimar Bagh, and Cheshma Shahi spring garden.',
        activities: ['Nishat Bagh Garden', 'Shalimar Bagh Garden', 'Cheshma Shahi Spring', 'Kashmiri Handicrafts & Shawl Shopping'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Srinagar'
      },
      {
        day: 5,
        title: 'Srinagar to Dharamshala Scenic Drive',
        description: 'Cross from Jammu & Kashmir into Himachal Pradesh via the Pir Panjal ranges. Arrive in Dharamshala / McLeod Ganj, the spiritual home of the Tibetan government-in-exile.',
        activities: ['Scenic Inter-State Mountain Drive', 'McLeod Ganj Evening Stroll', 'Tibetan Night Market'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Dharamshala'
      },
      {
        day: 6,
        title: 'Dharamshala to Manali via Kullu Valley',
        description: 'Morning visit to the Dalai Lama Temple Complex and Tsuglagkhang. Scenic drive through tea gardens and along the Beas River to Kullu. Visit Kullu shawl weavers, then arrive in Manali.',
        activities: ['Dalai Lama Temple Complex', 'Kullu Shawl Weaving Centre', 'River Rafting in Beas (optional)', 'Manali Arrival'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Manali'
      },
      {
        day: 7,
        title: 'Manali Solang Valley & Atal Tunnel Adventure',
        description: 'Full day of mountain thrills in Solang Valley: paragliding, zorbing, and quad biking. Drive through the 9.02km engineering marvel Atal Tunnel into Lahaul Valley to see the frozen Sissu waterfall.',
        activities: ['Solang Valley Paragliding', 'Atal Tunnel Crossing', 'Sissu Waterfall in Lahaul Valley', 'Mall Road Evening Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Manali'
      },
      {
        day: 8,
        title: 'Hadimba Temple & Departure from Chandigarh / Delhi',
        description: 'Visit the historic 450-year-old wooden Hadimba Devi Temple nestled in towering cedar forests. Timely transfer to Chandigarh or Delhi airport for your return flight.',
        activities: ['Hadimba Devi Temple', 'Vashisht Hot Water Springs', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 11. KERALA (5N/6D & 6N/7D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-kerala',
    match_destination: 'Kerala',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 36000,
    original_price: 49000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kochi & Scenic Drive to Munnar Hills',
        description: 'Arrive at Cochin International Airport. Meet your private chauffeur and embark on a scenic 4-hour uphill drive to Munnar (1,600m), passing rubber plantations, Cheeyappara and Valara waterfalls.',
        activities: ['Cochin Airport Pickup', 'Cheeyappara Waterfalls Photo Stop', 'Valara Waterfalls', 'Munnar Tea Hills Check-in'],
        meals: ['Dinner'],
        overnight: 'Munnar'
      },
      {
        day: 2,
        title: 'Munnar Tea Estates & Eravikulam National Park',
        description: 'Explore the rolling tea carpets of Munnar. Visit Eravikulam National Park, home to the endangered Nilgiri Tahr mountain goat. Visit Mattupetty Dam, Echo Point, and the Tea Museum.',
        activities: ['Eravikulam National Park Safari', 'Mattupetty Dam Boating', 'Echo Point Walk', 'Tata Tea Museum Tasting'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Munnar'
      },
      {
        day: 3,
        title: 'Munnar to Thekkady & Periyar Wildlife Boat Safari',
        description: 'Scenic drive through Cardamom Hills to Thekkady. Afternoon boat safari on Periyar Lake inside the Periyar Tiger Reserve to spot wild elephants, bison, and otters at the water’s edge.',
        activities: ['Periyar Lake Wildlife Boat Safari', 'Organic Spice Plantation Tour', 'Evening Kalaripayattu Martial Arts Show'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Thekkady'
      },
      {
        day: 4,
        title: 'Thekkady to Alleppey Luxury Houseboat Cruise',
        description: 'Descend to Alleppey ("Venice of the East"). Board your traditional thatched Kettuvallam luxury houseboat at noon. Cruise through serene canals, paddy fields, and enjoy freshly cooked Kerala meals.',
        activities: ['Private Houseboat Boarding', 'Backwater Canal Cruise', 'Village Life Observation', 'Authentic Karimeen Pollichathu Dinner'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Alleppey (Houseboat)'
      },
      {
        day: 5,
        title: 'Alleppey to Fort Kochi Heritage & Cultural Walk',
        description: 'Disembark after breakfast and drive to historic Fort Kochi. Stroll past iconic Chinese Fishing Nets, visit St. Francis Church (Vasco da Gama’s burial site), and the Jewish Synagogue in Jew Town.',
        activities: ['Chinese Fishing Nets Walk', 'St. Francis Church', 'Jewish Synagogue & Jew Town', 'Evening Kathakali Dance Drama'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kochi'
      },
      {
        day: 6,
        title: 'Kerala Spice Shopping & Cochin Airport Departure',
        description: 'Morning visit to Broadway and Lulu Mall for premium black pepper, cardamom, banana chips, and handloom cottons. Timely transfer to Cochin Airport for your return flight.',
        activities: ['Kerala Spice & Banana Chips Shopping', 'Cochin Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-kerala',
    match_destination: 'Kerala',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 1,
    price: 44000,
    original_price: 58000,
    itinerary: [
      {
        day: 1,
        title: 'Kochi Arrival & Fort Kochi Heritage Walk',
        description: 'Arrive at Cochin International Airport. Private hotel transfer. Afternoon walking tour of historic Fort Kochi: Chinese Fishing Nets, St. Francis Church (Vasco da Gama\'s burial place), and Jew Town.',
        activities: ['Airport Meet & Greet', 'Chinese Fishing Nets Walk', 'St. Francis Church', 'Jew Town & Synagogue'],
        meals: ['Dinner'],
        overnight: 'Kochi'
      },
      {
        day: 2,
        title: 'Kochi to Munnar Mist-Clad Tea Hills',
        description: 'Scenic 4-hour drive up into the Western Ghats to Munnar (1,600m). Stop at Cheeyappara and Valara waterfalls. Check-in to your resort surrounded by emerald green tea plantations.',
        activities: ['Cheeyappara Waterfall Stop', 'Valara Waterfalls', 'Munnar Scenic Drive', 'Evening Tea Garden Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Munnar'
      },
      {
        day: 3,
        title: 'Munnar Sightseeing — Eravikulam & Mattupetty',
        description: 'Explore Eravikulam National Park, home to the endangered Nilgiri Tahr mountain goat. Visit Mattupetty Dam, Echo Point, Kundala Lake, and the Tea Museum with tea tasting session.',
        activities: ['Eravikulam National Park Safari', 'Mattupetty Dam Boating', 'Echo Point', 'Tea Museum & Tasting'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Munnar'
      },
      {
        day: 4,
        title: 'Munnar to Thekkady Periyar Wildlife Reserve',
        description: 'Drive through spice-growing hills to Thekkady. Afternoon boat safari on Periyar Lake inside Periyar Tiger Reserve to spot wild elephants, bison, and sambar deer. Evening Kathakali performance.',
        activities: ['Periyar Lake Wildlife Boat Safari', 'Spice Plantation Guided Tour', 'Evening Kathakali & Kalaripayattu Show'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Thekkady'
      },
      {
        day: 5,
        title: 'Thekkady to Alleppey Private Houseboat Cruise',
        description: 'Drive down to Alleppey ("Venice of the East"). Board your private traditional thatched Kettuvallam houseboat. Cruise through narrow canals, palm-fringed lagoons, and lush paddy fields with all meals onboard.',
        activities: ['Houseboat Boarding at Noon', 'Backwater Lagoon Cruise', 'Village Canal Exploration', 'Candlelit Onboard Dinner'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Alleppey (Houseboat)'
      },
      {
        day: 6,
        title: 'Alleppey to Marari / Kovalam Coastal Beach',
        description: 'Disembark after a leisurely breakfast. Drive to the tranquil golden sands of Marari Beach. Day at leisure to relax beneath swaying coconut palms and enjoy a signature Ayurvedic massage.',
        activities: ['Houseboat Disembarkation', 'Marari Beach Relaxation', 'Traditional Ayurvedic Rejuvenation Massage'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Marari Beach'
      },
      {
        day: 7,
        title: 'Kerala Souvenir Shopping & Kochi Departure',
        description: 'Morning at leisure by the sea. Shop for black pepper, green cardamom, cashews, and traditional banana chips. Transfer to Cochin International Airport for departure.',
        activities: ['Spice & Handloom Souvenir Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 12. SEVEN SISTER (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-seven-sisters',
    match_destination: 'Seven Sisters',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 48000,
    original_price: 64000,
    itinerary: [
      {
        day: 1,
        title: 'Guwahati Arrival & Scenic Drive to Shillong',
        description: 'Arrive at Lokpriya Gopinath Bordoloi Airport in Guwahati. Scenic 3-hour drive to Shillong ("Scotland of the East") with a picturesque stop at serene Umiam Lake (Barapani).',
        activities: ['Airport Greeting', 'Umiam Lake Viewpoint & Water Sports', 'Shillong Police Bazar Evening Walk'],
        meals: ['Dinner'],
        overnight: 'Shillong'
      },
      {
        day: 2,
        title: 'Shillong to Cherrapunjee Waterfalls & Mawsmai Cave',
        description: 'Drive along cloud-kissed ridges to Cherrapunjee (Sohra). Marvel at the dramatic Nohkalikai Falls (tallest plunge waterfall in India), Seven Sisters Falls, and explore limestone Mawsmai Cave.',
        activities: ['Nohkalikai Falls Viewpoint', 'Seven Sisters Waterfall', 'Mawsmai Limestone Cave', 'Eco Park Canyon View'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Cherrapunjee'
      },
      {
        day: 3,
        title: 'Mawlynnong Village & Crystal-Clear Dawki River',
        description: 'Visit Mawlynnong, recognized as Asia’s cleanest village. See the Single Living Root Bridge, then drive to Dawki on the Indo-Bangladesh border for a country boat ride on the glass-clear Umngot River.',
        activities: ['Mawlynnong Cleanest Village Tour', 'Riwai Single Living Root Bridge', 'Dawki Umngot River Boating', 'Indo-Bangla Border Post'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Shillong'
      },
      {
        day: 4,
        title: 'Shillong to Kaziranga National Park via Tea Gardens',
        description: 'Morning drive down the Khasi hills through lush Assam tea gardens to the UNESCO World Heritage wildlife haven of Kaziranga National Park, home of the Great One-Horned Rhinoceros.',
        activities: ['Scenic Assam Tea Garden Drive', 'Kaziranga Orchid & Biodiversity Park', 'Bihu Traditional Folk Dance Show'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kaziranga'
      },
      {
        day: 5,
        title: 'Kaziranga 4x4 Jeep Safari & Rhino Spotting',
        description: 'Thrilling open-top 4x4 jeep safari in the Central and Western ranges of Kaziranga. Spot one-horned rhinos, wild water buffaloes, swamp deer, and rich migratory birdlife.',
        activities: ['Kaziranga Open-Jeep Safari', 'One-Horned Rhino Photography', 'Tea Estate Walk & Tasting'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Kaziranga'
      },
      {
        day: 6,
        title: 'Kamakhya Temple Blessings & Guwahati Departure',
        description: 'Morning drive to Guwahati. Visit the sacred hilltop Kamakhya Devi Temple, one of the 51 Shakti Peethas. Timely transfer to Guwahati Airport for your flight back home.',
        activities: ['Kamakhya Temple Darshan', 'Brahmaputra Riverfront View', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-seven-sisters',
    match_destination: 'Seven Sisters',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 64000,
    original_price: 84000,
    itinerary: [
      {
        day: 1,
        title: 'Guwahati Arrival & Scenic Drive to Shillong',
        description: 'Arrive at Guwahati Airport. Meet your tour manager and embark on a scenic 3-hour drive to Shillong ("Scotland of the East"). Stop at picturesque Umiam Lake (Barapani) for water sports.',
        activities: ['Airport Meet & Greet', 'Umiam Lake Boating', 'Police Bazar Evening Walk'],
        meals: ['Dinner'],
        overnight: 'Shillong'
      },
      {
        day: 2,
        title: 'Shillong to Cherrapunjee Waterfalls & Caves',
        description: 'Drive along cloud-kissed ridges to Cherrapunjee (Sohra). Marvel at the dramatic Nohkalikai Falls (tallest plunge waterfall in India), Seven Sisters Falls, and explore the limestone caverns of Mawsmai Cave.',
        activities: ['Nohkalikai Falls', 'Seven Sisters Falls', 'Mawsmai Cave Spelunking', 'Eco Park Canyon View'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Cherrapunjee'
      },
      {
        day: 3,
        title: 'Double Decker Living Root Bridge Trek',
        description: 'Trek down through dense subtropical rainforest into Nongriat village to cross the incredible 250-year-old Double Decker Living Root Bridge crafted from living Ficus elastica trees.',
        activities: ['Nongriat Living Root Bridge Trek', 'Rainbow Falls Natural Pool Swim', 'Rainforest Flora Exploration'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Cherrapunjee'
      },
      {
        day: 4,
        title: 'Dawki Umngot River & Mawlynnong Cleanest Village',
        description: 'Visit Mawlynnong, recognized as Asia\'s cleanest village. Stroll through bamboo paths and cross the Riwai root bridge. Continue to Dawki for a country boat ride on the crystal-clear Umngot River.',
        activities: ['Mawlynnong Village Tour', 'Riwai Single Root Bridge', 'Dawki Crystal River Boating', 'Indo-Bangladesh Border Photo'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Shillong'
      },
      {
        day: 5,
        title: 'Shillong to Kaziranga National Park',
        description: 'Drive from the Khasi hills into the fertile Brahmaputra floodplains of Assam. Reach Kaziranga National Park, world-famous sanctuary of the Great Indian One-Horned Rhinoceros.',
        activities: ['Scenic Assam Countryside Drive', 'Kaziranga Orchid & Biodiversity Park', 'Assamese Cultural Dance Show'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Kaziranga'
      },
      {
        day: 6,
        title: 'Kaziranga UNESCO Rhino Safari & Tea Estates',
        description: 'Early morning elephant-back safari to observe rhinos grazing in morning mist. Afternoon 4x4 open-top jeep safari in the Central range to spot wild water buffaloes, swamp deer, and tigers.',
        activities: ['Early Morning Elephant Safari', 'Central Range 4x4 Jeep Safari', 'Hathikuli Organic Tea Estate Visit'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Kaziranga'
      },
      {
        day: 7,
        title: 'Kaziranga to Guwahati & Kamakhya Temple',
        description: 'Drive back to Guwahati along the mighty Brahmaputra river. Visit the revered hilltop Kamakhya Temple, one of the 51 sacred Shakti Peethas. Evening sunset river cruise on the Brahmaputra.',
        activities: ['Kamakhya Devi Temple Darshan', 'Brahmaputra Sunset River Cruise', 'Fancy Bazar Handicraft Shopping'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Guwahati'
      },
      {
        day: 8,
        title: 'Guwahati Souvenir Shopping & Airport Departure',
        description: 'Morning visit to Sualkuchi silk weaving village or local market for authentic Muga golden silk and Assam tea. Private transfer to Guwahati Airport for your flight home.',
        activities: ['Assam Muga Silk & Tea Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 13. SIKKIM (5N/6D & 7N/8D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-sikkim',
    match_destination: 'Sikkim',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 42000,
    original_price: 58000,
    itinerary: [
      {
        day: 1,
        title: 'Bagdogra / NJP Arrival & Scenic Drive to Gangtok',
        description: 'Arrive at Bagdogra Airport (IXB) or NJP Railway Station. Scenic 4.5-hour drive winding alongside the roaring Teesta River to Gangtok (1,650m). Hotel check-in and evening walk on pedestrian MG Marg.',
        activities: ['Teesta River Valley Drive', 'Gangtok Hotel Check-in', 'MG Marg Pedestrian Promenade Walk'],
        meals: ['Dinner'],
        overnight: 'Gangtok'
      },
      {
        day: 2,
        title: 'Excursion to Sacred Tsomgo Lake & Baba Mandir',
        description: 'Full-day excursion to the sacred high-altitude glacial Tsomgo Lake (3,753m) surrounded by snow-covered peaks. Continue to the historic Baba Harbhajan Singh Memorial Temple near Nathula Pass.',
        activities: ['Tsomgo Glacial Lake Visit', 'Yak Ride Photography', 'Baba Harbhajan Singh Mandir', 'Snow Views at Kyongnosla'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok Cultural Tour & Scenic Drive to Pelling',
        description: 'Morning tour of Gangtok: Do-Drul Chorten Stupa, Namgyal Institute of Tibetology, and flower exhibition. Scenic mountain drive to the tranquil hill station of Pelling with Kanchenjunga vistas.',
        activities: ['Do-Drul Chorten Stupa', 'Tibetology Institute', 'Scenic Drive via Ravangla Buddha Park', 'Pelling Check-in'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pelling'
      },
      {
        day: 4,
        title: 'Pelling Skywalk, Pemayangtse & Rabdentse Ruins',
        description: 'Walk on India’s first glass Skywalk leading to the colossal Chenrezig statue. Tour the 300-year-old Pemayangtse Monastery and walk through dense oak woods to the historic Rabdentse Ruins.',
        activities: ['Pelling Glass Skywalk Walk', 'Chenrezig Giant Statue', 'Pemayangtse Monastery Tour', 'Rabdentse Ancient Palace Ruins'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pelling'
      },
      {
        day: 5,
        title: 'Kanchenjunga Falls, Khecheopalri Lake & Rimbi',
        description: 'Full-day Pelling sightseeing: visit roaring Kanchenjunga Falls, sacred wish-fulfilling Khecheopalri Lake where birds are said not to let a single leaf float, and Rimbi Orange Garden.',
        activities: ['Kanchenjunga Waterfall', 'Sacred Khecheopalri Lake Walk', 'Rimbi Rock Garden & River'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pelling'
      },
      {
        day: 6,
        title: 'Panoramic Sunrise over Kanchenjunga & Departure',
        description: 'Golden sunrise view over Mt. Kanchenjunga (8,586m) directly from your resort balcony. Scenic downhill drive to Bagdogra Airport / NJP Railway Station for return journey.',
        activities: ['Kanchenjunga Sunrise View', 'Scenic Descent Drive', 'Bagdogra / NJP Departure Drop'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-sikkim',
    match_destination: 'Sikkim',
    duration: '7N/8D',
    days: 8,
    nights: 7,
    is_default: 1,
    price: 56000,
    original_price: 74000,
    itinerary: [
      {
        day: 1,
        title: 'Bagdogra / NJP to Gangtok Hill Capital',
        description: 'Arrive at Bagdogra Airport (IXB) or NJP Railway Station. Scenic 4.5-hour drive winding alongside the turquoise Teesta River to Gangtok (1,650m). Evening walk along pedestrian MG Marg.',
        activities: ['Airport Meet & Greet', 'Teesta River Valley Drive', 'MG Marg Promenade Evening Stroll'],
        meals: ['Dinner'],
        overnight: 'Gangtok'
      },
      {
        day: 2,
        title: 'Tsomgo Glacial Lake & Baba Mandir Excursion',
        description: 'Day trip to sacred Tsomgo Lake (3,753m) with yak rides along snowbanks. Continue to Baba Harbhajan Singh Memorial Temple near the Indo-China border at Nathula Pass.',
        activities: ['Tsomgo Glacial Lake', 'Yak Riding along the Shore', 'Baba Harbhajan Singh Mandir', 'Kyongnosla Alpine Sanctuary'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok to North Sikkim (Lachen)',
        description: 'Embark on an epic journey into North Sikkim. Drive past Singhik viewpoint with breathtaking views of Mt. Kanchenjunga, Seven Sisters Waterfalls, and the confluence at Chungthang to reach Lachen (2,750m).',
        activities: ['Singhik Kanchenjunga Viewpoint', 'Seven Sisters Waterfall Stop', 'Naga Waterfall', 'Lachen Alpine Village Check-in'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Lachen'
      },
      {
        day: 4,
        title: 'Gurudongmar Sacred Lake (5,183m) to Lachung',
        description: 'Early morning expedition to sacred Gurudongmar Lake, one of the world\'s highest lakes, surrounded by snow-capped peaks. Return to Lachen, then drive to picturesque Lachung village.',
        activities: ['Gurudongmar Sacred Lake Expedition', 'Cold Desert Plateau Drive', 'Chopta Valley Scenic Stop', 'Lachung River Walk'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Lachung'
      },
      {
        day: 5,
        title: 'Yumthang Valley of Flowers to Gangtok',
        description: 'Visit the alpine paradise of Yumthang Valley (3,564m) carpeted with rhododendrons. Optional excursion to Zero Point (Yumesamdong, 4,660m). Afternoon scenic drive back to Gangtok.',
        activities: ['Yumthang Valley of Flowers', 'Hot Water Spring Dip', 'Zero Point Snow View (optional)', 'Scenic Return Drive to Gangtok'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        overnight: 'Gangtok'
      },
      {
        day: 6,
        title: 'Gangtok to Pelling via Namchi Chardham & Buddha Park',
        description: 'Drive toward West Sikkim. Stop at the massive 108-foot Shiva statue at Siddheshwar Dham (Chardham) in Namchi and the serene 130-foot seated Buddha statue at Ravangla Buddha Park.',
        activities: ['Namchi Chardham Complex', 'Ravangla Buddha Park', 'Tea Garden Drive', 'Pelling Sunset View'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pelling'
      },
      {
        day: 7,
        title: 'Pelling Skywalk, Pemayangtse & Rabdentse Ruins',
        description: 'Walk on India\'s first glass Skywalk leading to the Chenrezig statue. Tour 300-year-old Pemayangtse Monastery and walk through pine forests to the ruins of Rabdentse, ancient capital of Sikkim.',
        activities: ['Pelling Glass Skywalk', 'Pemayangtse Monastery Tour', 'Rabdentse Ancient Palace Ruins', 'Kanchenjunga Waterfall'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Pelling'
      },
      {
        day: 8,
        title: 'Pelling to Bagdogra / NJP Departure',
        description: 'Catch sunrise over Mt. Kanchenjunga from your hotel balcony. Scenic downhill drive through the foothills to Bagdogra Airport / NJP Railway Station for your flight home.',
        activities: ['Sunrise over Mt. Kanchenjunga', 'Scenic Foothill Drive', 'Airport / Railway Departure'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 14. RAJASTHAN (5N/6D & 6N/7D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'domestic',
    tour_slug: 'dom-rajasthan',
    match_destination: 'Rajasthan',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 39000,
    original_price: 54000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Pink City Jaipur & Chokhi Dhani',
        description: 'Arrive at Jaipur International Airport or Railway Station. Royal welcome and check-in to heritage hotel. Evening visit to Chokhi Dhani ethnic village for folk dances, camel rides, and Rajasthani thali.',
        activities: ['Airport Traditional Welcome', 'Chokhi Dhani Cultural Village', 'Kalbelia Folk Dance', 'Royal Rajasthani Thali'],
        meals: ['Dinner'],
        overnight: 'Jaipur'
      },
      {
        day: 2,
        title: 'Jaipur Royal Forts, Hawa Mahal & City Palace',
        description: 'Ascend to the hilltop Amber Fort by open jeep. Photograph the honeycomb facade of Hawa Mahal (Palace of Winds), explore City Palace museum, and visit Jantar Mantar observatory.',
        activities: ['Amber Fort Jeep Ascent', 'Sheesh Mahal (Mirror Palace)', 'Hawa Mahal Photo Stop', 'City Palace & Jantar Mantar'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Jaipur'
      },
      {
        day: 3,
        title: 'Jaipur to Blue City Jodhpur via Holy Pushkar',
        description: 'Drive across the Aravalli plains to holy Pushkar. Visit the world’s only Brahma Temple and sacred Pushkar Lake. Continue drive into the sun city Jodhpur.',
        activities: ['Brahma Temple Darshan', 'Pushkar Sacred Lake Ghats', 'Scenic Highway Drive to Jodhpur', 'Clock Tower & Sardar Market Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Jodhpur'
      },
      {
        day: 4,
        title: 'Mehrangarh Fort, Jaswant Thada & Drive to Udaipur',
        description: 'Tour the colossal Mehrangarh Fort towering 400 feet above Jodhpur’s blue houses. Visit the white marble cenotaph of Jaswant Thada, then drive through Ranakpur to Udaipur.',
        activities: ['Mehrangarh Fort Museum & Palaces', 'Jaswant Thada Marble Cenotaph', 'Ranakpur 1444 Marble Pillar Jain Temple', 'Udaipur Arrival'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Udaipur'
      },
      {
        day: 5,
        title: 'Udaipur City Palace & Lake Pichola Sunset Boat Ride',
        description: 'Explore Rajasthan’s largest palace complex at Udaipur City Palace. Stroll through the ornamental fountains of Saheliyon-Ki-Bari, and take an evening boat cruise on Lake Pichola past Jag Mandir.',
        activities: ['Udaipur City Palace Complex', 'Saheliyon-Ki-Bari Royal Gardens', 'Lake Pichola Sunset Boat Cruise', 'Jag Mandir Palace View'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Udaipur'
      },
      {
        day: 6,
        title: 'Jagdish Temple, Souvenir Shopping & Departure',
        description: 'Morning visit to 17th-century Jagdish Temple. Last-minute shopping for miniature paintings, leather mojris, and bandhani textiles before transfer to Udaipur Airport.',
        activities: ['Jagdish Temple Carvings', 'Hathi Pol Handicraft Market', 'Udaipur Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'domestic',
    tour_slug: 'dom-rajasthan',
    match_destination: 'Rajasthan',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 1,
    price: 49000,
    original_price: 66000,
    itinerary: [
      {
        day: 1,
        title: 'Jaipur Arrival & Chokhi Dhani Cultural Night',
        description: 'Arrive at Jaipur Airport. Traditional Rajasthani greeting and transfer to heritage hotel. Evening visit to Chokhi Dhani ethnic village for camel rides, puppet shows, folk dances, and an authentic royal thali dinner.',
        activities: ['Airport Meet & Greet', 'Chokhi Dhani Cultural Village', 'Ghoomar & Kalbelia Folk Dance', 'Authentic Rajasthani Thali'],
        meals: ['Dinner'],
        overnight: 'Jaipur'
      },
      {
        day: 2,
        title: 'Jaipur Forts — Amber, Hawa Mahal & City Palace',
        description: 'Ascend to hilltop Amber Fort by open jeep. See the glittering Sheesh Mahal (Mirror Palace). Visit the pink sandstone Hawa Mahal (Palace of Winds), City Palace museum, and UNESCO Jantar Mantar.',
        activities: ['Amber Fort Jeep Ride', 'Sheesh Mahal (Hall of Mirrors)', 'Hawa Mahal Photo Stop', 'City Palace & Jantar Mantar'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Jaipur'
      },
      {
        day: 3,
        title: 'Jaipur to Jodhpur via Sacred Pushkar',
        description: 'Morning drive across Rajasthan to the sacred pilgrimage town of Pushkar. Visit the rare Lord Brahma Temple and the 52 bathing ghats of Pushkar Lake. Continue into the Blue City of Jodhpur.',
        activities: ['Brahma Temple Visit', 'Pushkar Holy Lake Ghats', 'Scenic Desert Highway Drive', 'Jodhpur Arrival'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Jodhpur'
      },
      {
        day: 4,
        title: 'Mehrangarh Fort & Drive to Udaipur via Ranakpur',
        description: 'Explore the impregnable 15th-century Mehrangarh Fort and Jaswant Thada marble cenotaph. Drive to the Lake City of Udaipur, stopping at Ranakpur\'s world-famous 1,444 intricately carved marble pillar Jain temple.',
        activities: ['Mehrangarh Fort Museum', 'Jaswant Thada', 'Ranakpur Jain Temple 1444 Pillars', 'Scenic Aravalli Mountain Drive'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Udaipur'
      },
      {
        day: 5,
        title: 'Udaipur City Palace & Lake Pichola Boat Cruise',
        description: 'Guided tour of Rajasthan\'s largest royal complex, Udaipur City Palace, overlooking Lake Pichola. Afternoon boat cruise around Jag Mandir island palace and sunset views over the City of Lakes.',
        activities: ['Udaipur City Palace Museum', 'Crystal Gallery', 'Lake Pichola Sunset Boat Cruise', 'Jag Mandir Island Walk'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Udaipur'
      },
      {
        day: 6,
        title: 'Saheliyon Ki Bari, Bagore Ki Haveli & Folk Arts',
        description: 'Visit Saheliyon-Ki-Bari (Courtyard of the Maidens) with marble fountains and lotus pools. Explore Bagore Ki Haveli museum on Gangaur Ghat and enjoy an evening Dharohar cultural folk performance.',
        activities: ['Saheliyon Ki Bari Lotus Pools', 'Bagore Ki Haveli Museum', 'Dharohar Cultural Dance Show', 'Local Bazaars for Mojris & Bandhani'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Udaipur'
      },
      {
        day: 7,
        title: 'Monsoon Palace & Udaipur Airport Departure',
        description: 'Morning drive up to the hilltop Sajjangarh (Monsoon Palace) for panoramic views across Udaipur\'s lakes and valleys. Timely private transfer to Udaipur Maharana Pratap Airport.',
        activities: ['Monsoon Palace (Sajjangarh) Viewpoint', 'Hathi Pol Handicraft Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 15. DUBAI (5N/6D & 6N/7D)
  // ─────────────────────────────────────────────────────────────
  {
    tour_type: 'international',
    tour_slug: 'int-dubai',
    match_destination: 'Dubai',
    duration: '5N/6D',
    days: 6,
    nights: 5,
    is_default: 0,
    price: 68000,
    original_price: 89000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dubai & Marina Luxury Dhow Cruise',
        description: 'Arrive at Dubai International Airport. VIP private transfer to your hotel. Evening luxury Dhow Cruise along the illuminated Dubai Marina with international buffet dinner and Tanoura dance show.',
        activities: ['Airport Meet & Greet', 'Hotel Check-in', 'Dubai Marina Luxury Dhow Cruise', 'Tanoura Live Dance Performance'],
        meals: ['Dinner'],
        overnight: 'Dubai'
      },
      {
        day: 2,
        title: 'Dubai City Highlights, Dubai Mall & Burj Khalifa',
        description: 'Morning city tour covering Dubai Creek, Al Fahidi Fort, and Gold & Spice Souks. Afternoon at Dubai Mall, watch the Dubai Fountain show, and ascend to Burj Khalifa 124th/125th floor observation deck.',
        activities: ['Dubai Creek & Souks', 'Dubai Mall Walk', 'Burj Khalifa 124th & 125th Floor', 'Dubai Fountain Water Show'],
        meals: ['Breakfast'],
        overnight: 'Dubai'
      },
      {
        day: 3,
        title: 'Thrilling Desert Safari, Dune Bashing & BBQ Gala',
        description: 'Morning at leisure. Afternoon 4x4 red dune desert safari with high-octane dune bashing, sandboarding, camel rides, henna painting, and an open-air barbecue gala dinner under the desert stars.',
        activities: ['4x4 Red Dune Bashing', 'Sandboarding', 'Camel Ride', 'Belly Dance & Fire Show', 'Barbecue Buffet Dinner'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Dubai'
      },
      {
        day: 4,
        title: 'Palm Jumeirah, Monorail & Miracle Garden',
        description: 'Drive along the iconic Palm Jumeirah trunk, ride the Palm Monorail, and stop for photos at Atlantis The Palm. Visit Dubai Miracle Garden showcasing 150 million blooming flowers.',
        activities: ['Palm Monorail Ride', 'Atlantis The Palm Photo Stop', 'Dubai Miracle Garden Walk', 'Global Village Cultural Pavilions'],
        meals: ['Breakfast'],
        overnight: 'Dubai'
      },
      {
        day: 5,
        title: 'Abu Dhabi Full-Day Tour & Sheikh Zayed Grand Mosque',
        description: 'Full-day excursion to Abu Dhabi. Marvel at the breathtaking white marble Sheikh Zayed Grand Mosque, drive along the Corniche, visit Emirates Palace, and photo stop at Ferrari World.',
        activities: ['Sheikh Zayed Grand Mosque Tour', 'Abu Dhabi Corniche Drive', 'Emirates Palace Photo Stop', 'Ferrari World Yas Island'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Dubai'
      },
      {
        day: 6,
        title: 'Gold Souk Souvenir Shopping & Airport Departure',
        description: 'Morning at leisure for last-minute shopping at Meena Bazaar or Mall of the Emirates. Timely private transfer to Dubai International Airport for your flight back home.',
        activities: ['Meena Bazaar / Souk Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  },
  {
    tour_type: 'international',
    tour_slug: 'int-dubai',
    match_destination: 'Dubai',
    duration: '6N/7D',
    days: 7,
    nights: 6,
    is_default: 1,
    price: 85000,
    original_price: 110000,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dubai & Marina Dhow Cruise',
        description: 'Arrive at Dubai International Airport. VIP airport pickup and transfer to your hotel. Evening luxury Dhow Cruise along Dubai Marina with dinner and live entertainment.',
        activities: ['Airport VIP Transfer', 'Dubai Marina Luxury Dhow Cruise', 'International Buffet Dinner'],
        meals: ['Dinner'],
        overnight: 'Dubai'
      },
      {
        day: 2,
        title: 'Dubai City Tour & Burj Khalifa',
        description: 'Explore Dubai Creek, Al Fahidi Historical District, Gold & Spice Souks. Afternoon visit to Dubai Mall and Burj Khalifa 124th/125th floor observation deck, followed by Dubai Fountain show.',
        activities: ['Al Fahidi Historical District', 'Gold & Spice Souks', 'Burj Khalifa Observation Deck', 'Dubai Fountain Show'],
        meals: ['Breakfast'],
        overnight: 'Dubai'
      },
      {
        day: 3,
        title: 'Desert Safari with Dune Bashing & BBQ',
        description: 'Morning at leisure. Afternoon 4x4 Desert Safari with thrilling red dune bashing, camel riding, sandboarding, falcon photography, and a lavish BBQ buffet dinner under starry skies with Tanoura & belly dance shows.',
        activities: ['4x4 Red Dune Bashing', 'Camel Riding & Sandboarding', 'Tanoura & Belly Dance Shows', 'Bedouin Camp BBQ Dinner'],
        meals: ['Breakfast', 'Dinner'],
        overnight: 'Dubai'
      },
      {
        day: 4,
        title: 'Palm Jumeirah, Atlantis & Monorail',
        description: 'Scenic drive to Palm Jumeirah, ride the Palm Monorail, photo stop at Atlantis The Palm, visit The View at The Palm, and unwind at JBR The Walk and Marina Beach.',
        activities: ['Palm Monorail Ride', 'The View at The Palm Observation Deck', 'Atlantis The Palm Photo Stop', 'JBR The Walk Beach Stroll'],
        meals: ['Breakfast'],
        overnight: 'Dubai'
      },
      {
        day: 5,
        title: 'Miracle Garden & Global Village',
        description: 'Visit the world\'s largest natural flower garden at Dubai Miracle Garden with 150 million blooming flowers. Evening at Global Village showcasing pavilions, shows, and culinary delights from 90+ countries.',
        activities: ['Dubai Miracle Garden', 'Global Village Cultural Fair', 'International Pavilion Tastings'],
        meals: ['Breakfast'],
        overnight: 'Dubai'
      },
      {
        day: 6,
        title: 'Abu Dhabi Day Trip & Sheikh Zayed Mosque',
        description: 'Full-day excursion to Abu Dhabi. Marvel at the breathtaking Sheikh Zayed Grand Mosque, drive along the Corniche, visit Emirates Palace and Ferrari World photo stop before returning to Dubai.',
        activities: ['Sheikh Zayed Grand Mosque Tour', 'Abu Dhabi Corniche & Breakwater', 'Emirates Palace Photo Stop', 'Ferrari World Yas Island'],
        meals: ['Breakfast', 'Lunch'],
        overnight: 'Dubai'
      },
      {
        day: 7,
        title: 'Souk Shopping & Airport Departure',
        description: 'Leisurely breakfast, last-minute shopping at Mall of the Emirates or Meena Bazaar. Timely private transfer to Dubai International Airport for your return flight.',
        activities: ['Mall of the Emirates / Gold Souk Shopping', 'Airport Departure Transfer'],
        meals: ['Breakfast'],
        overnight: 'Departure'
      }
    ]
  }
]

export function seedDurationsAndItineraries() {
  console.log('--- SEEDING DURATION PACKAGES AND ITINERARIES ---')
  let packagesCreatedOrUpdated = 0
  let itineraryDaysCreated = 0

  for (const item of SEED_TOUR_PACKAGES) {
    // 1. Resolve tour_id from the database
    let tourRecord
    if (item.tour_type === 'international') {
      tourRecord = db.prepare('SELECT id, destination, price, original_price FROM international_packages WHERE LOWER(destination) = LOWER(?)').get(item.match_destination)
    } else if (item.tour_type === 'domestic') {
      tourRecord = db.prepare('SELECT id, destination, price FROM domestic_packages WHERE LOWER(destination) = LOWER(?)').get(item.match_destination)
    }

    if (!tourRecord) {
      console.warn(`[Seed Warning] Could not find base tour for destination "${item.match_destination}" in ${item.tour_type}_packages`)
      continue
    }

    const payload = {
      tour_type: item.tour_type,
      tour_id: tourRecord.id,
      tour_slug: item.tour_slug,
      duration: item.duration,
      days: item.days,
      nights: item.nights,
      price: item.price || tourRecord.price,
      original_price: item.original_price || tourRecord.original_price,
      is_default: item.is_default,
      itinerary: item.itinerary
    }

    const saved = saveTourPackage(payload)
    if (saved) {
      packagesCreatedOrUpdated++
      itineraryDaysCreated += (saved.itinerary ? saved.itinerary.length : 0)
    }
  }

  console.log(`[Seed Result] Success! Processed ${packagesCreatedOrUpdated} duration packages with ${itineraryDaysCreated} total itinerary days across 15 tours.`)
  return { packagesCreatedOrUpdated, itineraryDaysCreated }
}

if (process.argv[1]?.endsWith('seed_durations.js')) {
  seedDurationsAndItineraries()
}
