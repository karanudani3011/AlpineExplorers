-- ==============================================================================
-- ALPINE EXPLORERS — SUPABASE SEED DATA (Service Categories, Tours & Blog Posts)
-- ==============================================================================
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qhbsilnramjkagdjitlp
-- 2. Click "SQL Editor" on the left sidebar.
-- 3. Click "New query" (+ button).
-- 4. Paste this entire file and click "Run".
-- ==============================================================================

-- Enable RLS & Public Read Access Policies
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'service_categories' AND policyname = 'Allow public read access on service_categories'
  ) THEN
    CREATE POLICY "Allow public read access on service_categories" ON public.service_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tours' AND policyname = 'Allow public read access on tours'
  ) THEN
    CREATE POLICY "Allow public read access on tours" ON public.tours FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow public read access on blog_posts'
  ) THEN
    CREATE POLICY "Allow public read access on blog_posts" ON public.blog_posts FOR SELECT USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. SEED SERVICE CATEGORIES
-- ------------------------------------------------------------------------------

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('international', 'International Tours', 'Globe', 'Curated transcontinental journeys across Europe, Asia, the Americas, and the Pacific with VIP concierge support.', 'International', 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('domestic', 'Domestic Tours', 'Map', 'Immerse yourself in breathtaking national parks, coastal highways, scenic heritage destinations, and vibrant cultures of India.', 'Domestic', 2)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('mountain', 'Mountain Expeditions', 'Mountain', 'High-altitude mountaineering, glacial passes, alpine meadows, and guided summit expeditions across the world''s greatest ranges.', 'Mountain', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('adventure', 'Adventure Tours & Camps', 'Tent', 'Thrilling white water rafting, wilderness glamping camps, canyon rappelling, and off-grid exploration.', 'Adventure', 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('family', 'Family Tours', 'Users', 'Stress-free, unforgettable multigenerational vacations with fairytale castles, interactive science, and family-friendly adventures.', 'Family', 5)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

INSERT INTO public.service_categories (id, title, icon, description, badge, display_order)
VALUES ('solo', 'Go Solo', 'Backpack', 'Independently crafted solo travel experiences — safe, flexible, and designed for the adventurous spirit who loves discovering the world alone.', 'Go Solo', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- 2. SEED TOURS
-- ------------------------------------------------------------------------------

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-dubai',
  'int-dubai',
  'international',
  'International Tours',
  'Dubai',
  'Dubai, UAE',
  '₹85,000',
  85000,
  '6N/7D',
  '2026-05-10',
  4.9,
  412,
  ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1521133573892-e44906baee46?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&h=700&fit=crop']::text[],
  '6N/7D ultra-luxury Dubai escape with Burj Khalifa, desert safari & marina cruise.',
  'Experience futuristic luxury in Dubai — soaring skyscrapers like the Burj Khalifa, gold and spice souks, exhilarating desert safaris, Palm Jumeirah, and world-class theme parks.',
  ARRAY['Burj Khalifa 124th & 125th Floor Observation Deck', 'Desert Safari with Dune Bashing, Camel Ride & BBQ Dinner', 'Dubai Marina Luxury Dhow Cruise with Dinner', 'Palm Jumeirah & Atlantis The Palm Monorail', 'Miracle Garden & Global Village Multi-Cultural Fair', 'Abu Dhabi Day Trip to Sheikh Zayed Grand Mosque']::text[],
  '[{"day":1,"title":"Arrival in Dubai & Marina Dhow Cruise","description":"Arrive at Dubai International Airport. VIP airport pickup and transfer to your hotel. Evening luxury Dhow Cruise along Dubai Marina with dinner and live entertainment."},{"day":2,"title":"Dubai City Tour & Burj Khalifa","description":"Explore Dubai Creek, Al Fahidi Historical District, Gold & Spice Souks. Afternoon visit to Dubai Mall and Burj Khalifa 124th/125th floor observation deck, followed by Dubai Fountain show."},{"day":3,"title":"Desert Safari with Dune Bashing & BBQ","description":"Morning at leisure. Afternoon 4x4 Desert Safari with thrilling red dune bashing, camel riding, sandboarding, falcon photography, and a lavish BBQ buffet dinner under starry skies with Tanoura & belly dance shows."},{"day":4,"title":"Palm Jumeirah, Atlantis & Monorail","description":"Scenic drive to Palm Jumeirah, ride the Palm Monorail, photo stop at Atlantis The Palm, visit The View at The Palm, and unwind at JBR The Walk and Marina Beach."},{"day":5,"title":"Miracle Garden & Global Village","description":"Visit the world''s largest natural flower garden at Dubai Miracle Garden with 150 million blooming flowers. Evening at Global Village showcasing pavilions, shows, and culinary delights from 90+ countries."},{"day":6,"title":"Abu Dhabi Day Trip & Sheikh Zayed Mosque","description":"Full-day excursion to Abu Dhabi. Marvel at the breathtaking Sheikh Zayed Grand Mosque, drive along the Corniche, visit Emirates Palace and Ferrari World photo stop before returning to Dubai."},{"day":7,"title":"Souk Shopping & Airport Departure","description":"Leisurely breakfast, last-minute shopping at Mall of the Emirates or Meena Bazaar. Timely private transfer to Dubai International Airport for your return flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-thailand',
  'int-thailand',
  'international',
  'International Tours',
  'Thailand & Bangkok',
  'Bangkok, Pattaya & Phuket, Thailand',
  '₹68,000',
  68000,
  '7N/8D',
  '2026-06-05',
  4.8,
  389,
  ARRAY['https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1000&h=700&fit=crop']::text[],
  '7N/8D complete Thailand journey across Bangkok, Pattaya & Phuket.',
  'Discover the best of Thailand — Bangkok''s ornate Buddhist temples, vibrant floating markets, chaotic night bazaars, combined with tropical paradise beaches, limestone cliffs, and island hopping.',
  ARRAY['Grand Palace & Temple of the Reclining Buddha (Wat Pho)', 'Chao Phraya Princess Luxury Dinner Cruise', 'Coral Island Speedboat Tour with Parasailing & Snorkeling', 'Phi Phi Islands & Maya Bay Speedboat Excursion', 'James Bond Island & Phang Nga Bay Sea Canoe', 'Damnoen Saduak Floating Market & Safari World']::text[],
  '[{"day":1,"title":"Arrival in Bangkok & Transfer to Pattaya","description":"Arrive at Suvarnabhumi Airport, meet our concierge and private transfer to Pattaya. Hotel check-in, evening Alcazar Cabaret Show and Pattaya Beach Road walk."},{"day":2,"title":"Coral Island (Koh Larn) Speedboat Adventure","description":"Speedboat cruise to Coral Island. Enjoy pristine white sand beaches, swimming, parasailing, undersea walking, and an authentic Thai seafood lunch buffet."},{"day":3,"title":"Pattaya to Bangkok & Chao Phraya Dinner Cruise","description":"Drive back to Bangkok. Visit Gems Gallery and transfer to hotel. Evening Chao Phraya River luxury dinner cruise with illuminated views of Wat Arun and the Grand Palace."},{"day":4,"title":"Bangkok Temples & Safari World","description":"Visit Wat Pho (Reclining Buddha), Wat Traimit (Golden Buddha), and the Grand Palace. Afternoon at Safari World & Marine Park with dolphin and stunt shows."},{"day":5,"title":"Fly Bangkok to Phuket & Patong Beach","description":"Morning flight to Phuket. Check-in to tropical beach resort. Evening explore Bangla Road, Patong Night Market, and sunset viewpoints."},{"day":6,"title":"Phi Phi Islands & Maya Bay Tour","description":"Full-day speedboat excursion to Phi Phi Don, Phi Phi Leh, Maya Bay (The Beach movie fame), Viking Cave, Monkey Beach, and snorkeling in crystal-clear turquoise waters."},{"day":7,"title":"James Bond Island & Sea Canoeing","description":"Speedboat trip across Phang Nga Bay. Explore James Bond Island (Koh Tapu), limestone caves, mangrove forests, and paddle sea canoes through Koh Panak sea caverns."},{"day":8,"title":"Phuket Old Town & Airport Departure","description":"Morning visit to Phuket Old Town Sino-Portuguese heritage street and Big Buddha. Afternoon transfer to Phuket International Airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-bali',
  'int-bali',
  'international',
  'International Tours',
  'Bali',
  'Ubud, Kuta & Nusa Penida, Bali',
  '₹78,000',
  78000,
  '7N/8D',
  '2026-05-18',
  4.9,
  295,
  ARRAY['https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&h=700&fit=crop']::text[],
  '7N/8D tropical paradise retreat across Ubud, Kuta & Nusa Penida.',
  'Immerse yourself in tropical paradise with Bali''s emerald rice terraces, cliff-hanging ancient sea temples, sacred monkey forests, volcanic lakes, and pristine Nusa Penida island beaches.',
  ARRAY['Uluwatu Sunset Temple perched on 70m ocean cliff with Kecak Dance', 'Nusa Penida Island Tour: Kelingking T-Rex Beach & Angel''s Billabong', 'Tegallalang Rice Terraces & Famous Bali Jungle Swing', 'Kintamani Volcano & Batur Lake Viewpoint', 'Ulun Danu Beratan Floating Temple on Lake Bratan', 'Water Sports Package at Tanjung Benoa (Banana Boat, Jet Ski)']::text[],
  '[{"day":1,"title":"Denpasar Arrival & Private Villa Check-in","description":"Arrive at Ngurah Rai International Airport (DPS). Traditional flower garland welcome, private transfer to luxury villa in Ubud, evening sunset relaxation."},{"day":2,"title":"Ubud Culture, Rice Terraces & Bali Swing","description":"Visit Sacred Monkey Forest Sanctuary, explore Tegallalang Emerald Rice Terraces, ride the iconic Bali Jungle Swing, and stroll through Ubud Royal Palace & Art Market."},{"day":3,"title":"Kintamani Volcano, Coffee Plantation & Tegenungan","description":"Scenic drive to Kintamani with panoramic views of active volcano Mount Batur and Lake Batur. Visit authentic Luwak coffee plantation and Tegenungan Waterfall."},{"day":4,"title":"Nusa Penida Island Day Tour by Speedboat","description":"Speedboat cruise to Nusa Penida Island. Explore the world-famous Kelingking T-Rex Cliff Beach, Broken Beach, Angel''s Billabong natural infinity pool, and Crystal Bay."},{"day":5,"title":"Ulun Danu Beratan & Handara Iconic Gate","description":"Journey to the Bedugul highlands. Visit the enchanting Ulun Danu Beratan Temple floating on Lake Bratan, snap photos at Handara Iconic Balinese Gate, and visit Tanah Lot Temple at sunset."},{"day":6,"title":"Tanjung Benoa Water Sports & Uluwatu Cliff","description":"Head to South Bali. Enjoy thrilling water sports at Tanjung Benoa (Parasailing, Jet Ski, Banana Boat). Afternoon drive to clifftop Uluwatu Temple for spectacular Indian Ocean sunset and Kecak Fire Dance."},{"day":7,"title":"Seminyak Beach Club & Traditional Balinese Spa","description":"Morning at leisure on Seminyak beach. Indulge in a 2-hour authentic Balinese herbal aromatherapy body massage & flower bath. Sunset at a world-class beach club."},{"day":8,"title":"Krisna Souvenir Bazaar & Airport Departure","description":"Breakfast at villa, shopping for Balinese handicrafts, batik, and souvenirs at Krisna Oleh-Oleh. Private transfer to Denpasar Airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-europe',
  'int-europe',
  'international',
  'International Tours',
  'Exclusive Europe',
  'Paris, Swiss Alps, Venice & Rome',
  '₹1,85,000',
  185000,
  '10 Days / 9 Nights',
  '2026-05-15',
  5,
  324,
  ARRAY['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&h=700&fit=crop']::text[],
  '10 Days / 9 Nights grand European voyage across France, Switzerland & Italy.',
  'The ultimate European grand voyage spanning the romantic streets of Paris, snow-covered summits of the Swiss Alps, timeless Venetian canals, and the historic Roman Empire.',
  ARRAY['Eiffel Tower Summit with Seine River Romantic Cruise', 'Louvre Museum Priority Access with Mona Lisa Viewing', 'Jungfraujoch — Top of Europe at 3,454m & Ice Palace', 'Mount Titlis World''s First Rotating Rotair Cable Car', 'Venice Sunset Gondola Ride through Grand Canal', 'Rome Colosseum, Roman Forum & Vatican St. Peter''s Basilica']::text[],
  '[{"day":1,"title":"Arrival in Paris — The City of Lights","description":"Arrive at Paris Charles de Gaulle Airport. Meet your European tour concierge and transfer to your hotel. Evening romantic Seine River cruise showcasing illuminated bridges and landmarks."},{"day":2,"title":"Paris City Highlights & Eiffel Tower Summit","description":"Comprehensive city tour: Champs-Élysées, Arc de Triomphe, Place de la Concorde, Opera Garnier, and Notre-Dame photo stop. Ascend to the Eiffel Tower summit followed by Louvre Museum exterior."},{"day":3,"title":"Paris to Switzerland via TGV High-Speed Train","description":"Board the ultra-fast TGV train through picturesque French countryside into Switzerland. Arrive in Interlaken/Lucerne nestled between alpine lakes and snow-capped peaks."},{"day":4,"title":"Mount Titlis with Ice Flyer & Lucerne","description":"Ascend Mount Titlis on the world''s first revolving Rotair cable car. Experience the Cliff Walk suspension bridge, Glacier Cave, and Ice Flyer. Afternoon Lucerne Chapel Bridge and Lion Monument walk."},{"day":5,"title":"Jungfraujoch — Top of Europe Excursion","description":"Cogwheel train journey up to Jungfraujoch (3,454 meters). Tour the magical Ice Palace, Sphinx Observatory with panoramic views of Aletsch Glacier, and Alpine Sensation."},{"day":6,"title":"Switzerland to Venice (Italy)","description":"Scenic coach drive through the Swiss Alps and Italian Lake District into Venice. Arrive in the floating city, check-in to hotel, evening at leisure."},{"day":7,"title":"Venice Gondola Ride & St. Mark''s Square","description":"Private motorboat transfer to St. Mark''s Square. Guided tour of St. Mark''s Basilica, Doge''s Palace, Bridge of Sighs, Murano Glass demonstration, and a quintessential Venetian Gondola ride."},{"day":8,"title":"Venice to Florence & Rome","description":"Drive to Florence — the cradle of the Renaissance. Walking tour of Florence Cathedral (Duomo), Ponte Vecchio, Piazza della Signoria. Continue drive to Rome."},{"day":9,"title":"Rome City Tour, Colosseum & Trevi Fountain","description":"Full-day tour of Rome: Exterior of Colosseum, Roman Forum, Victor Emmanuel Monument, toss a coin into the Trevi Fountain, Pantheon, and Piazza Navona. Farewell European banquet dinner."},{"day":10,"title":"Vatican City & Departure from Rome","description":"Visit Vatican City — St. Peter''s Square and Basilica. Last-minute Italian shopping before private transfer to Rome Fiumicino Airport for your departure flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-phuket-krabi',
  'int-phuket-krabi',
  'international',
  'International Tours',
  'Phuket & Krabi',
  'Phuket & Krabi, Thailand',
  '₹64,000',
  64000,
  '7N/8D',
  '2026-06-12',
  4.8,
  245,
  ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop']::text[],
  '7N/8D Andaman island paradise across Phuket & Krabi.',
  'Explore the stunning Andaman coastline — towering limestone karsts, crystal-clear emerald pools, iconic Railay Beach, Hong Islands, and the world-famous Phi Phi archipelago.',
  ARRAY['Phi Phi Don & Phi Phi Leh Speedboat Tour with Maya Bay', 'Krabi 4-Island Speedboat Tour (Poda, Chicken, Tup & Phra Nang Cave)', 'Hong Islands Marine Park Lagoon with Sea Kayaking', 'Emerald Pool (Sa Morakot) & Natural Hot Springs Waterfall', 'James Bond Island Sea Canoe in Phang Nga Bay', 'Tiger Cave Temple (Wat Tham Suea) Summit Panorama']::text[],
  '[{"day":1,"title":"Arrival in Phuket & Patong Beach Check-in","description":"Arrive at Phuket International Airport. Transfer to beachfront resort in Patong. Evening free to relax on the beach, explore night markets and seaside cafes."},{"day":2,"title":"Phi Phi Islands & Maya Bay Speedboat Tour","description":"Full-day speedboat island hopping tour: Maya Bay, Pileh Lagoon swimming, Viking Cave, Monkey Beach, snorkeling among colorful coral reefs, and buffet lunch on Phi Phi Don."},{"day":3,"title":"James Bond Island & Phang Nga Bay Canoeing","description":"Cruise into Phang Nga Bay National Park. Marvel at the dramatic James Bond Island needle rock, paddle canoes through hidden limestone caves, and visit Panyee floating Muslim village."},{"day":4,"title":"Phuket to Krabi via Scenic Coastal Drive","description":"Check-out and scenic overland transfer to Krabi (Ao Nang). En route stop at Wat Suwan Kuha (Monkey Cave Temple). Check-in to Krabi tropical resort."},{"day":5,"title":"Krabi 4-Island Speedboat Tour & Railay Beach","description":"Speedboat tour of Krabi''s famous 4 Islands: Koh Poda, Chicken Island snorkeling, Tup Island sandbar walk at low tide, and Phra Nang Cave Beach with princess shrine at Railay."},{"day":6,"title":"Emerald Pool, Hot Springs & Tiger Cave Temple","description":"Jungle excursion to the mineral-rich crystal Emerald Pool, relax in natural cascading geothermal hot spring waterfalls, and climb to the Tiger Cave Temple panoramic viewpoint."},{"day":7,"title":"Hong Islands Lagoon & Sunset Beach Dinner","description":"Speedboat cruise to Hong Island. Explore the emerald enclosed lagoon, snorkel at Pelay Beach, relax on powdery sand, and enjoy a romantic farewell sunset dinner in Ao Nang."},{"day":8,"title":"Krabi Souvenirs & Airport Departure","description":"Morning breakfast, leisure swim at resort pool, last-minute shopping at Ao Nang walking street, and transfer to Krabi / Phuket Airport for flight back."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-sri-lanka',
  'int-sri-lanka',
  'international',
  'International Tours',
  'Sri Lanka',
  'Sigiriya, Kandy, Nuwara Eliya, Yala & Bentota',
  '₹58,000',
  58000,
  '7N/8D',
  '2026-07-10',
  4.8,
  218,
  ARRAY['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop']::text[],
  '7N/8D complete island circuit across Sigiriya, Kandy, Nuwara Eliya, Yala & Bentota.',
  'The pearl of the Indian Ocean — ancient UNESCO rock fortresses, scenic hill country blue trains, misty Ceylon tea plantations, wild elephant safaris, and golden sandy beaches.',
  ARRAY['Sigiriya Lion Rock Fortress 5th Century UNESCO Citadel Climb', 'Kandy Temple of the Sacred Tooth Relic & Cultural Dance', 'Scenic Blue Train Ride through Misty Nuwara Eliya Tea Valleys', 'Yala National Park 4x4 Leopard & Elephant Safari', 'Bentota Madu River Mangrove Boat Safari & Turtle Hatchery', 'Galle Dutch Fort 17th Century UNESCO Heritage Walk']::text[],
  '[{"day":1,"title":"Colombo Arrival & Transfer to Sigiriya","description":"Arrive at Bandaranaike International Airport (CMB). Meet our guide and transfer to Sigiriya. En route visit Pinnawala Elephant Orphanage to watch herds bathe in the river."},{"day":2,"title":"Sigiriya Lion Rock Fortress & Dambulla Cave Temple","description":"Morning climb of the ancient Sigiriya Lion Rock citadel with ancient frescoes and water gardens. Afternoon visit the Golden Dambulla Rock Cave Temple complex containing 150+ Buddha statues."},{"day":3,"title":"Matale Spice Garden & Kandy Sacred Tooth Temple","description":"Drive to Kandy. Visit an aromatic Matale spice garden and Royal Botanical Gardens Peradeniya. Evening visit the sacred Temple of the Tooth Relic and watch a traditional Kandyan cultural fire-dance show."},{"day":4,"title":"Scenic Train to Nuwara Eliya & Tea Factory","description":"Board the legendary Sri Lankan blue train through misty highlands, waterfalls, and tea gardens to Nuwara Eliya (\"Little England\"). Visit a functioning Ceylon tea factory and Gregory Lake."},{"day":5,"title":"Ella Nine Arch Bridge & Yala National Park","description":"Drive past Ravana Falls to Ella. Photo stop at the iconic Nine Arch Bridge. Continue down to Yala. Afternoon 4x4 open jeep safari in Yala National Park for leopards, elephants, and sloth bears."},{"day":6,"title":"Yala to Bentota Coastal Beach Resort","description":"Drive along the southern coastline to the tropical beaches of Bentota. En route visit the historic 17th-century UNESCO Galle Dutch Fort with lighthouse and boutique streets."},{"day":7,"title":"Madu River Mangrove Boat Safari & Turtle Hatchery","description":"Scenic motorboat safari on the Madu River through mangrove tunnels with fish therapy stops. Visit Kosgoda Sea Turtle Conservation Project to release baby turtles into the ocean."},{"day":8,"title":"Colombo City Tour & Airport Departure","description":"Drive to Colombo. Panoramic city tour: Gangaramaya Temple, Independence Memorial Hall, Galle Face Green, and shopping at Odel / Pettah Market. Transfer to airport for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-lakshadweep',
  'int-lakshadweep',
  'international',
  'International Tours',
  'Lakshadweep',
  'Agatti, Bangaram & Thinnakara Islands',
  '₹45,000',
  45000,
  '4N/5D',
  '2026-05-22',
  4.9,
  176,
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&h=700&fit=crop']::text[],
  '4N/5D tropical atoll paradise across Agatti, Bangaram & Thinnakara.',
  'India''s pristine tropical archipelago in the Arabian Sea — shallow turquoise lagoons, vibrant living coral atolls, coconut groves, and tranquil island tranquility untouched by crowds.',
  ARRAY['Scenic Flight Landing on Narrow Agatti Island Coral Airstrip', 'Speedboat Day Excursion to Uninhabited Bangaram Island', 'Thinnakara Island Coral Reef Snorkeling with Sea Turtles', 'Glass-Bottom Boat Lagoon Cruise with Live Coral Viewing', 'Kayaking & Stand-Up Paddleboarding in Crystal Turquoise Lagoon', 'Kalpitti Island Sunset Boat Cruise']::text[],
  '[{"day":1,"title":"Flight Arrival at Agatti Island Lagoon","description":"Fly into Agatti Airport with breathtaking aerial views of coral reefs. Warm coconut water welcome and transfer to beach resort. Afternoon lagoon walk and relaxation."},{"day":2,"title":"Agatti Water Sports & Glass Bottom Boat","description":"Morning glass-bottom boat ride over shallow lagoons to view live coral gardens, clownfish, and sea anemones. Afternoon kayaking, swimming, and sunset at Agatti South Beach."},{"day":3,"title":"Speedboat Excursion to Bangaram & Thinnakara","description":"Full-day excursion by speedboat across turquoise waters to uninhabited Bangaram Island and Thinnakara Island. Snorkel with sea turtles, relax on deserted sandbanks, and enjoy beach picnic lunch."},{"day":4,"title":"Coral Reef Snorkeling & Kalpitti Island Cruise","description":"Morning guided deep-reef snorkeling session. Afternoon boat trip to Kalpitti Island for panoramic views, beachcombing, and farewell seaside candlelight dinner."},{"day":5,"title":"Island Souvenirs & Flight Departure","description":"Morning breakfast overlooking the turquoise lagoon. Local handicraft souvenir shopping, transfer to Agatti Airport for your return flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-singapore-malaysia',
  'int-singapore-malaysia',
  'international',
  'International Tours',
  'Singapore & Malaysia',
  'Singapore & Kuala Lumpur, Malaysia',
  '₹89,000',
  89000,
  '7N/8D',
  '2026-06-20',
  4.8,
  310,
  ARRAY['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop']::text[],
  '7N/8D dual-country explorer across Singapore & Malaysia.',
  'The twin jewel combination of Southeast Asia — futuristic architecture at Marina Bay, Gardens by the Bay, Universal Studios Sentosa, paired with Kuala Lumpur''s iconic Petronas Towers and Genting Highlands.',
  ARRAY['Gardens by the Bay Flower Dome, Cloud Forest & Supertree Light Show', 'Sentosa Island & Universal Studios Full Day Theme Park Pass', 'Night Safari Tram Ride with Nocturnal Wildlife', 'Petronas Twin Towers Skybridge & Observation Deck', 'Batu Caves Rainbow Steps & Lord Murugan Statue', 'Genting Highlands Skyway Cable Car & Theme Park']::text[],
  '[{"day":1,"title":"Arrival in Singapore & Night Safari","description":"Arrive at Singapore Changi Airport. Transfer to hotel. Evening visit to the world''s first Night Safari with guided tram ride through 7 geographical zones of nocturnal wildlife."},{"day":2,"title":"Singapore City Tour & Gardens by the Bay","description":"City orientation: Merlion Park, Marina Bay Sands photo stop, Chinatown, Little India. Afternoon visit Gardens by the Bay (Flower Dome & Cloud Forest) and Supertree Grove Light Show."},{"day":3,"title":"Full Day Universal Studios & Sentosa Island","description":"Full day at Sentosa Island with unlimited ride access to Universal Studios (Transformers, Jurassic Park, Battlestar Galactica), S.E.A. Aquarium, and Wings of Time laser show."},{"day":4,"title":"Singapore to Kuala Lumpur via Malacca Heritage","description":"Scenic cross-border coach drive to Malaysia. Stop at UNESCO World Heritage city of Malacca (St. Paul''s Hill, Dutch Square, Jonker Street). Arrive in Kuala Lumpur and check in."},{"day":5,"title":"Kuala Lumpur City Tour & Petronas Twin Towers","description":"Tour King''s Palace, National Monument, Independence Square, and ascend the iconic Petronas Twin Towers Skybridge & 86th Floor observation deck. Evening shopping at Bukit Bintang."},{"day":6,"title":"Batu Caves & Genting Highlands Cable Car","description":"Visit the dramatic Batu Caves with 272 rainbow steps and 140ft golden Murugan statue. Board the Genting Skyway cable car to Genting Highlands mountain resort and theme parks."},{"day":7,"title":"Putrajaya Tour & Sunway Lagoon","description":"Morning tour of administrative capital Putrajaya (Pink Mosque & Perdana Putra). Afternoon optional Sunway Lagoon mega theme park or shopping at Pavilion KL."},{"day":8,"title":"Chocolates Shopping & KLIA Airport Departure","description":"Morning visit to Beryl''s Chocolate Kingdom, last-minute shopping at Central Market, and transfer to Kuala Lumpur International Airport for your departure flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-maldives',
  'int-maldives',
  'international',
  'International Tours',
  'Maldives',
  'South Male / Ari Atoll, Maldives',
  '₹1,15,000',
  115000,
  '4N/5D',
  '2026-05-28',
  5,
  264,
  ARRAY['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop']::text[],
  '4N/5D ultra-luxury private island overwater villa escape.',
  'Pure seclusion in the Indian Ocean — stay in luxury overwater bungalows perched directly above crystal turquoise lagoons, world-class coral reefs, and romantic sunset catamaran cruises.',
  ARRAY['Luxury Overwater Villa Stay with Direct Lagoon Ocean Access', 'Speedboat / Seaplane Airport Transfers across Turquoise Atolls', 'Sunset Dolphin Cruise with Complimentary Champagne & Canapes', 'House Reef Snorkeling with Manta Rays, Reef Sharks & Sea Turtles', 'Complimentary Non-Motorized Water Sports (Kayak, Paddleboard)', 'Romantic 4-Course Candlelight Dinner on Private White Sand Beach']::text[],
  '[{"day":1,"title":"Velana Airport Arrival & Speedboat to Private Island","description":"Arrive at Velana International Airport in Male. VIP meet-and-greet, luxury speedboat transfer skimming over turquoise atolls to your private 5-star island resort. Check into your Overwater Villa."},{"day":2,"title":"Coral Reef Snorkeling & Marine Exploration","description":"Morning guided snorkeling excursion along the resort''s house reef to observe manta rays, clownfish, and reef sharks. Afternoon complimentary kayaking and stand-up paddleboarding."},{"day":3,"title":"Sunset Dolphin Safari Cruise & Beach Dinner","description":"Leisure morning at your private villa sundeck. Late afternoon board a luxury dhoni boat for a Sunset Dolphin Cruise watching playful spinner dolphins, followed by private beach dinner."},{"day":4,"title":"Island Wellness, Spa & Sandbank Picnic","description":"Indulge in holistic island spa therapy overlooking the ocean, enjoy a private castaway sandbank picnic, and take part in evening stingray and nurse shark feeding sessions."},{"day":5,"title":"Floating Breakfast & Speedboat Departure","description":"Signature floating breakfast in your private pool overlooking the boundless Indian Ocean. Leisure swim, check-out, and speedboat transfer to Male Airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-vietnam',
  'int-vietnam',
  'international',
  'International Tours',
  'Vietnam',
  'Hanoi, Ha Long Bay, Da Nang, Hoi An & Saigon',
  '₹88,000',
  88000,
  '9N/10D',
  '2026-06-15',
  4.9,
  198,
  ARRAY['https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1000&h=700&fit=crop']::text[],
  '9N/10D grand Vietnam expedition from Hanoi & Ha Long Bay to Da Nang & Ho Chi Minh.',
  'Journey through the captivating landscapes and rich heritage of Vietnam — emerald waters and limestone pillars of Ha Long Bay, lantern-lit alleys of Hoi An, and vibrant street life of Hanoi.',
  ARRAY['Overnight 5-Star Luxury Cruise on Ha Long Bay with Kayaking', 'Hoi An Ancient Town UNESCO Lantern-Lit Walking Tour', 'Ba Na Hills & Golden Giant Hands Bridge Cable Car', 'Hanoi Old Quarter 36 Streets Cyclo Ride & Water Puppet Show', 'Cu Chi Underground Guerrilla Tunnels Exploration', 'Mekong Delta Riverboat Cruise with Coconut Village Tour']::text[],
  '[{"day":1,"title":"Arrival in Hanoi & Old Quarter Street Walk","description":"Arrive at Noi Bai International Airport in Hanoi. Transfer to hotel in the French Quarter. Evening street food tasting tour and cyclo ride around Hoan Kiem Lake."},{"day":2,"title":"Hanoi City Tour & Water Puppet Show","description":"Visit Ho Chi Minh Mausoleum, One Pillar Pagoda, Temple of Literature (Vietnam''s first university), and watch a traditional Thang Long Water Puppet performance."},{"day":3,"title":"Hanoi to Ha Long Bay Overnight Luxury Cruise","description":"Drive to Ha Long Bay and board a luxury 5-star cruise. Sail past thousands of limestone karsts, visit Sung Sot Cave (Surprise Cave), kayak at Luon Cave, and sunset party on deck."},{"day":4,"title":"Ha Long Bay Tai Chi & Flight to Da Nang","description":"Morning sunrise Tai Chi session on sundeck. Visit Titov Island for panoramic bay views. Brunch on board, disembark and transfer to Hanoi Airport for flight to Da Nang / Hoi An."},{"day":5,"title":"Ba Na Hills & Golden Giant Hands Bridge","description":"Ride the world''s longest single-wire cable car to Ba Na Hills. Walk across the iconic Golden Giant Hands Bridge, visit French Village, Fantasy Park, and Linh Ung Pagoda."},{"day":6,"title":"Hoi An Ancient Town & Coconut Basket Boat","description":"Cam Thanh Coconut Village basket boat ride. Afternoon walking tour of UNESCO Hoi An: Japanese Covered Bridge, Tan Ky Old House, and evening release of floating flower lanterns on the river."},{"day":7,"title":"Fly Da Nang to Ho Chi Minh City (Saigon)","description":"Fly to Ho Chi Minh City. Visit War Remnants Museum, Notre Dame Cathedral, Central Post Office, Reunification Palace, and Ben Thanh Market for shopping."},{"day":8,"title":"Cu Chi Tunnels Historical Exploration","description":"Half-day trip to Cu Chi Tunnels. Explore the vast 250km underground network of tunnels, trapdoors, living quarters, and hospitals used during the Vietnam War."},{"day":9,"title":"Mekong Delta Riverboat & Island Tour","description":"Excursion to My Tho in the Mekong Delta. Cruise the river by motorized boat and sampan through coconut canals, visit honey bee farms, fruit orchards, and enjoy traditional folk music."},{"day":10,"title":"Saigon Shopping & Airport Departure","description":"Leisure morning for cafe hopping and shopping at Saigon Square. Private transfer to Tan Son Nhat International Airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-baku',
  'int-baku',
  'international',
  'International Tours',
  'Baku',
  'Baku, Gobustan & Gabala, Azerbaijan',
  '₹68,000',
  68000,
  '6N/7D',
  '2026-06-25',
  4.8,
  165,
  ARRAY['https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop']::text[],
  '6N/7D Land of Fire journey across Baku, Gobustan & Gabala.',
  'Where ancient Silk Road history meets striking futuristic architecture — Azerbaijan''s Land of Fire offers burning mountains, mud volcanoes, Caspian Sea boulevards, and Caucasian mountain landscapes.',
  ARRAY['Heydar Aliyev Center Architectural Masterpiece by Zaha Hadid', 'Gobustan National Park Petroglyphs & Active Mud Volcanoes', 'Ateshgah Fire Temple & Yanar Dag Eternal Burning Mountain', 'Icherisheher UNESCO Old City with Maiden Tower & Shirvanshahs Palace', 'Gabala Tufandag Mountain Ropeway & Nohur Lake Tour', 'Caspian Sea Boulevard, Little Venice & Flame Towers Light Show']::text[],
  '[{"day":1,"title":"Arrival in Baku & Flame Towers Night View","description":"Arrive at Heydar Aliyev International Airport (GYD). Private VIP transfer to hotel. Evening visit to Highland Park for panoramic views of Baku Bay and illuminated Flame Towers."},{"day":2,"title":"Baku Old City (Icherisheher) & Modern City Tour","description":"Explore UNESCO Icherisheher Old City, Maiden Tower, Palace of the Shirvanshahs, and Miniature Book Museum. Afternoon walk on Baku Boulevard, Little Venice boat ride, and Nizami Street."},{"day":3,"title":"Gobustan Mud Volcanoes, Fire Temple & Yanar Dag","description":"Excursion to Gobustan Rock Art Cultural Landscape and bubbling Mud Volcanoes. Afternoon visit to ancient Ateshgah Zoroastrian Fire Temple and the natural burning gas fire at Yanar Dag."},{"day":4,"title":"Day Trip to Gabala Mountain Resort","description":"Scenic drive through the Caucasus foothills to Gabala. Visit serene Nohur Lake, take the Tufandag Mountain Ropeway for panoramic alpine views, and visit 7 Beauties Waterfall."},{"day":5,"title":"Shamakhi Historical Tour & Alpine Views","description":"Drive to Shamakhi ancient capital. Visit the historic Juma Mosque, Diri Baba Mausoleum carved into rock, and a local Caucasian winery for tea and local sweets."},{"day":6,"title":"Heydar Aliyev Center & Shopping at Ganjlik Mall","description":"Visit the world-renowned Heydar Aliyev Cultural Center designed by Zaha Hadid. Afternoon shopping for local carpets, spices, and caviar at Yaşıl Bazar (Green Market) and modern malls."},{"day":7,"title":"Baku Souvenirs & Airport Departure","description":"Leisurely breakfast, last-minute stroll along the Caspian Promenade, check-out, and private transfer to Baku International Airport for return flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'int-bhutan',
  'int-bhutan',
  'international',
  'International Tours',
  'Bhutan',
  'Paro, Thimphu, Punakha & Phobjikha, Bhutan',
  '₹95,000',
  95000,
  '9N/10D',
  '2026-06-08',
  5,
  142,
  ARRAY['https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '9N/10D spiritual Himalayan voyage across Paro, Thimphu, Punakha & Phobjikha.',
  'The mystical Himalayan Kingdom of Gross National Happiness — hike to the iconic clifftop Tiger''s Nest Monastery, cross high mountain passes adorned with prayer flags, and explore ancient Buddhist dzongs.',
  ARRAY['Hike to the Legendary Tiger''s Nest (Taktsang Monastery) at 3,120m', 'Dochula Pass 108 Memorial Chortens & Himalayan Panoramic Peaks', 'Punakha Dzong — Palace of Great Happiness at River Confluence', 'Buddha Dordenma 169ft Giant Bronze Statue in Thimphu', 'Phobjikha Glacial Valley & Black-Necked Crane Sanctuary', 'Traditional Bhutanese Hot Stone Bath & Archery Experience']::text[],
  '[{"day":1,"title":"Spectacular Flight to Paro & Drive to Thimphu","description":"Thrilling flight into Paro Valley with Everest and Kanchenjunga views. Meet our licensed Bhutanese guide and drive along Wangchu River to capital city Thimphu. Check-in and relax."},{"day":2,"title":"Thimphu Sightseeing & Buddha Dordenma","description":"Visit the colossal Buddha Dordenma statue overlooking Thimphu valley, Memorial Chorten, National Institute of Zorig Chusum (13 Traditional Arts), and Tashichho Dzong fortress."},{"day":3,"title":"Thimphu to Punakha via Dochula Pass","description":"Drive over Dochula Pass (3,100m) with 108 stupas and panoramic 360-degree snow peaks. Descend into subtropical Punakha valley and visit Chimi Lhakhang (Fertility Temple)."},{"day":4,"title":"Punakha Dzong & Longest Suspension Bridge","description":"Tour the magnificent Punakha Dzong situated at the confluence of Pho Chhu and Mo Chhu rivers. Walk across Bhutan''s longest suspension bridge and hike to Khamsum Yulley Namgyal Chorten."},{"day":5,"title":"Punakha to Phobjikha Valley (Gangtey)","description":"Scenic drive through dense rhododendron and oak forests to the glacial Phobjikha Valley. Visit 17th-century Gangtey Monastery and Black-Necked Crane Information Centre."},{"day":6,"title":"Gangtey Nature Trail & Return to Paro","description":"Morning guided Gangtey Nature Trail through pine forests and alpine meadows. Scenic drive back to Paro valley. Visit Ta Dzong (National Museum) and Rinpung Dzong."},{"day":7,"title":"Pilgrimage Hike to Tiger''s Nest Monastery (Taktsang)","description":"Embark on the unforgettable 4-5 hour hike up through pine forests draped with Spanish moss to the dramatic cliff-hanging Paro Taktsang (Tiger''s Nest) perched 900m above the valley."},{"day":8,"title":"Chele La Pass (Highest Motorable Pass) & Haa Valley","description":"Drive to Chele La Pass at 3,988m with views of Mount Jomolhari. Excursion to pristine Haa Valley with visits to Lhakhang Karpo (White Temple) and Lhakhang Nagpo (Black Temple)."},{"day":9,"title":"Paro Cultural Experience & Traditional Hot Stone Bath","description":"Try traditional Bhutanese archery (national sport), visit local farmhouse, wear traditional Gho/Kira attire, and soothe muscles in a traditional herb-infused hot stone bath."},{"day":10,"title":"Paro International Airport Departure","description":"Breakfast at resort. Bid farewell (\"Tashi Delek\") to your Bhutanese guide and transfer to Paro International Airport for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-kashmir-himachal',
  'dom-kashmir-himachal',
  'domestic',
  'Domestic Tours',
  'Kashmir & Himachal',
  'Srinagar, Gulmarg, Pahalgam & Manali',
  '₹52,000',
  52000,
  '7N/8D',
  '2026-05-15',
  4.9,
  310,
  ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1610041321327-b794c052db27?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop']::text[],
  '7N/8D grand Himalayan circuit across Srinagar, Gulmarg, Pahalgam & Manali.',
  'Experience Paradise on Earth and the Land of the Gods — peaceful Dal Lake shikara rides, snow-bound Gulmarg Gondola, lush Pahalgam valleys, high Atal Tunnel, and Solang Valley adventures.',
  ARRAY['Dal Lake Luxury Houseboat Overnight Stay & Sunset Shikara Ride', 'Gulmarg Gondola Cable Car Ride to Kongdoori & Apharwat Peak', 'Pahalgam Valley of Shepherds, Betaab Valley & Aru Valley', 'Sonmarg Meadow of Gold & Thajiwas Glacier Trek', 'Manali Atal Tunnel, Sissu Waterfall & Solang Valley Snow Sports', 'Mughal Gardens: Shalimar Bagh, Nishat Bagh & Chashme Shahi']::text[],
  '[{"day":1,"title":"Arrival in Srinagar & Dal Lake Houseboat","description":"Arrive at Srinagar International Airport. Warm Kashmiri welcome and transfer to luxury carved wooden houseboat on Dal Lake. Enjoy a relaxing sunset Shikara ride across Floating Gardens."},{"day":2,"title":"Mughal Gardens & Shankaracharya Temple","description":"Explore Nishat Bagh (Garden of Bliss), Shalimar Bagh (Abode of Love), Chashme Shahi, and visit the hilltop Shankaracharya Temple for panoramic Srinagar city views."},{"day":3,"title":"Gulmarg Gondola Ride & Snow Paradise","description":"Full-day excursion to Gulmarg (Meadow of Flowers) at 8,825ft. Ride the world-famous Gulmarg Gondola cable car up to Phase 1 & 2 for thrilling snow activities and alpine panorama."},{"day":4,"title":"Pahalgam Valley of Shepherds & Betaab Valley","description":"Drive past saffron fields of Pampore and Awantipora ruins to Pahalgam. Visit scenic Betaab Valley, Aru Valley, and Chandanwari along the sparkling Lidder River."},{"day":5,"title":"Sonmarg Excursion & Transfer to Dharamshala","description":"Drive to Sonmarg (Meadow of Gold) with views of Thajiwas Glacier and Sindh River. Scenic transfer towards Himachal Pradesh foothills into Dharamshala."},{"day":6,"title":"Dharamshala to Manali via Kullu Valley","description":"Visit Dalai Lama Temple Complex and Bhagsu Waterfall in McLeodganj. Scenic drive to Manali via Kullu Valley with river rafting and Shawl Factory stops. Check-in in Manali."},{"day":7,"title":"Atal Tunnel, Solang Valley & Sissu","description":"Drive through the engineering marvel Atal Tunnel (9.02km) into Lahaul Valley to visit Sissu Waterfall. Afternoon adventure sports at Solang Valley (Paragliding, Zorbing, Quad Biking)."},{"day":8,"title":"Manali Local Sightseeing & Chandigarh Departure","description":"Visit Hadimba Temple, Vashisht Hot Springs, and Mall Road. Scenic descent to Chandigarh Airport / Railway Station for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-goa',
  'dom-goa',
  'domestic',
  'Domestic Tours',
  'Goa',
  'North & South Goa',
  '₹36,000',
  36000,
  '6N/7D',
  '2026-05-20',
  4.8,
  445,
  ARRAY['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop']::text[],
  '6N/7D complete Goa holiday across North & South Goa with Dudhsagar waterfalls.',
  'Sun, sand, and spice — palm-fringed Arabian Sea beaches, historic Portuguese churches, thrilling water sports, Dudhsagar jungle waterfalls, and vibrant nightlife cafes.',
  ARRAY['Calangute, Baga & Anjuna Water Sports Combo (Parasailing, Jet Ski)', 'Dudhsagar 4-Tier Jungle Waterfall 4x4 Jeep Safari', 'Old Goa UNESCO Churches: Basilica of Bom Jesus & Se Cathedral', 'Mandovi River Sunset Luxury Cruise with Goan Folk Dance', 'Spice Plantation Guided Tour with Traditional Goan Buffet Lunch', 'Fort Aguada, Chapora "Dil Chahta Hai" Fort & Vagator Sunset']::text[],
  '[{"day":1,"title":"Arrival in Goa & Beach Resort Check-in","description":"Arrive at Goa Airport (GOI/GOX). AC transfer to your beachfront resort. Evening at leisure strolling along Calangute / Candolim beach and enjoying beach shack dining."},{"day":2,"title":"North Goa Beaches, Fort Aguada & Water Sports","description":"Visit historic 17th-century Portuguese Fort Aguada and lighthouse. Head to Baga Beach for thrilling water sports: Parasailing, Jet Ski, Banana Ride, and Bumper Ride."},{"day":3,"title":"Anjuna, Vagator & Chapora Fort Sunset","description":"Explore Anjuna Beach, Vagator Beach rocky cliffs, and climb the iconic Chapora Fort overlooking the Arabian Sea. Evening explore Tito''s Lane and local flea markets."},{"day":4,"title":"Dudhsagar Waterfalls Safari & Spice Plantation","description":"Thrilling open 4x4 jeep safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar Waterfalls. Swim in natural pool. Visit Sahakari Spice Farm for guided tour and authentic buffet."},{"day":5,"title":"South Goa Heritage Churches & Miramar Beach","description":"Tour UNESCO Old Goa: Basilica of Bom Jesus (St. Francis Xavier relics) and Se Cathedral. Visit Mangueshi Temple, Miramar Beach, Dona Paula viewpoint, and evening Mandovi River Sunset Cruise."},{"day":6,"title":"Grand Island Boat Trip & Dolphin Spotting","description":"Scenic boat cruise to Grand Island. Spot playful wild dolphins, enjoy bottom fishing, snorkeling in calm bays, and a beachside BBQ lunch."},{"day":7,"title":"Souvenir Shopping & Airport Departure","description":"Leisurely breakfast, shopping for Goan feni, cashews, spices, and souvenirs at Panaji Market. Private transfer to airport for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-andaman',
  'dom-andaman',
  'domestic',
  'Domestic Tours',
  'Andaman',
  'Port Blair, Havelock & Neil Island',
  '₹48,000',
  48000,
  '4N/5D',
  '2026-05-25',
  4.9,
  268,
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop']::text[],
  '4N/5D tropical island adventure across Port Blair, Havelock & Neil.',
  'Pristine emerald islands surrounded by turquoise waters — white sands of Radhanagar Beach, crystal snorkeling at Elephant Beach, natural coral bridges, and historic Cellular Jail.',
  ARRAY['Radhanagar Beach on Havelock Island — Rated Asia''s Best Beach', 'Elephant Beach Speedboat Ride with Coral Reef Snorkeling', 'Cellular Jail Light & Sound Show & Freedom Fighter Memorial', 'High-Speed Luxury Catamaran Cruise (Makruzz / Nautika)', 'Neil Island Natural Rock Bridge & Sunset at Laxmanpur Beach', 'Corbyn''s Cove Coastal Drive & Coconut Palm Groves']::text[],
  '[{"day":1,"title":"Port Blair Arrival & Cellular Jail Light Show","description":"Arrive at Veer Savarkar Airport in Port Blair. Transfer to hotel. Visit historic Cellular Jail national memorial, explore the museum, and witness the stirring evening Light and Sound show."},{"day":2,"title":"High-Speed Cruise to Havelock & Radhanagar Beach","description":"Board luxury private catamaran (Makruzz/Nautika) to Havelock Island (Swaraj Dweep). Check into beach resort. Afternoon visit Radhanagar Beach (Beach No. 7) for a magical sunset."},{"day":3,"title":"Elephant Beach Snorkeling & Water Sports","description":"Speedboat ride to Elephant Beach. Complimentary guided snorkeling session to observe vibrant live coral reefs, sea anemones, and schools of colorful tropical fish. Glass bottom boat ride."},{"day":4,"title":"Neil Island Natural Bridge & Return to Port Blair","description":"Catamaran cruise to Neil Island (Shaheed Dweep). Visit the famous Natural Coral Rock Bridge and Laxmanpur Beach sunset point. Late afternoon cruise back to Port Blair."},{"day":5,"title":"Sagarika Souvenir Emporium & Airport Departure","description":"Breakfast at hotel, shopping for sea shell handicrafts, pearl jewelry, and wood carvings at Sagarika Government Emporium. Transfer to airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-kerala',
  'dom-kerala',
  'domestic',
  'Domestic Tours',
  'Kerala',
  'Cochin, Munnar, Thekkady, Alleppey & Kovalam',
  '₹46,000',
  46000,
  '6N/7D',
  '2026-06-10',
  4.8,
  278,
  ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&h=700&fit=crop']::text[],
  '6N/7D classic Kerala circuit across Cochin, Munnar, Thekkady, Alleppey & Kovalam.',
  'God''s Own Country — cruise through tranquil emerald backwaters on a traditional thatched houseboat, wander misty tea plantations in Munnar, and rejuvenate with authentic Ayurvedic wellness.',
  ARRAY['Alleppey Private Luxury Houseboat Overnight Backwater Cruise', 'Munnar Rolling Tea Gardens, Eravikulam Nilgiri Tahr Sanctuary & Mattupetty', 'Thekkady Periyar Wildlife Sanctuary Boat Safari & Spice Walk', 'Fort Kochi Chinese Fishing Nets, Jew Town & Kathakali Dance Show', 'Kovalam Crescent Lighthouse Beach & Samudra Beach', 'Complimentary Rejuvenating Herbal Ayurvedic Massage Session']::text[],
  '[{"day":1,"title":"Arrival in Cochin & Heritage Fort Kochi","description":"Arrive at Cochin International Airport (COK). Visit Fort Kochi, Chinese Fishing Nets, St. Francis Church, Santa Cruz Basilica, Jew Town, and attend an evening Kathakali cultural dance show."},{"day":2,"title":"Cochin to Munnar via Cheeyappara Waterfalls","description":"Scenic 4-hour drive climbing into the Western Ghats past rubber plantations, spice groves, and cascading Cheeyappara and Valara Waterfalls. Check into hill resort in Munnar."},{"day":3,"title":"Munnar Tea Gardens & Eravikulam National Park","description":"Visit Eravikulam National Park (home to endangered Nilgiri Tahr mountain goat), Tea Museum with live processing, Mattupetty Dam, Echo Point, and Kundala Lake."},{"day":4,"title":"Munnar to Thekkady & Periyar Wildlife Safari","description":"Scenic drive to Thekkady. Visit an aromatic spice plantation (cardamom, pepper, cinnamon). Afternoon boat safari on Periyar Lake in the heart of the tiger & elephant reserve."},{"day":5,"title":"Thekkady to Alleppey Private Houseboat Cruise","description":"Drive to Alleppey (Venice of the East). Board your private AC luxury houseboat. Cruise through narrow canals, palm-fringed lagoons, and paddy fields with freshly cooked Kerala feast."},{"day":6,"title":"Alleppey to Kovalam Beach Resort","description":"Disembark houseboat after breakfast. Drive south along the coast to Kovalam. Check into beach resort. Afternoon relaxation on the golden sands of Lighthouse Beach."},{"day":7,"title":"Trivandrum Sightseeing & Airport Departure","description":"Visit Sree Padmanabhaswamy Temple (exterior) and Napier Museum in Trivandrum. Private transfer to Trivandrum / Cochin Airport for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-seven-sisters',
  'dom-seven-sisters',
  'domestic',
  'Domestic Tours',
  'Seven Sisters',
  'Assam, Meghalaya & Arunachal Pradesh',
  '₹58,000',
  58000,
  '7N/8D',
  '2026-06-18',
  4.9,
  195,
  ARRAY['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '7N/8D Northeast wonderland across Assam, Meghalaya & Arunachal.',
  'Journey across Northeast India''s unexplored wonderland — Meghalaya''s living root bridges, crystal-clear Dawki River, Kaziranga one-horned rhinos, Arunachal snow peaks, and vibrant tribal traditions.',
  ARRAY['Double Decker Living Root Bridge Trek in Nongriat (Meghalaya)', 'Dawki Umngot River Boating over Crystal Clear Floating Waters', 'Kaziranga National Park Elephant & Open Jeep Safari (One-Horned Rhinos)', 'Mawlynnong — Asia''s Cleanest Village & Balancing Rock', 'Cherrapunji Nohkalikai Falls & Mawsmai Limestone Caves', 'Kamakhya Devi Temple & Brahmaputra Sunset River Cruise']::text[],
  '[{"day":1,"title":"Guwahati Arrival & Kamakhya Temple to Shillong","description":"Arrive at Guwahati Airport. Visit sacred Kamakhya Temple. Scenic drive to Shillong (Scotland of the East) with photo stop at picturesque Umiam Lake (Barapani). Check-in in Shillong."},{"day":2,"title":"Shillong to Cherrapunji Waterfalls & Caves","description":"Drive to Cherrapunji (Sohra). Marvel at Nohkalikai Falls (India''s tallest plunge waterfall), Seven Sisters Falls, Mawsmai limestone cave, and Eco Park overlooking Bangladesh plains."},{"day":3,"title":"Nongriat Double Decker Living Root Bridge Trek","description":"Trek down into the lush tropical rainforest to the ancient bio-engineered Double Decker Living Root Bridge and natural turquoise rock pools of Rainbow Falls."},{"day":4,"title":"Dawki Crystal River & Mawlynnong Cleanest Village","description":"Visit Mawlynnong (Asia''s cleanest village) and Living Root Bridge. Drive to Dawki on the Indo-Bangladesh border for a magical boat ride on crystal-clear Umngot River."},{"day":5,"title":"Shillong Sightseeing & Transfer to Kaziranga","description":"Visit Don Bosco Museum, Elephant Falls, and Shillong Peak. Scenic drive across Brahmaputra Valley to Kaziranga National Park UNESCO World Heritage Site."},{"day":6,"title":"Kaziranga Elephant & Jeep Safari","description":"Early morning elephant safari in Central / Western Range for close-up sightings of Great Indian One-Horned Rhinoceros. Afternoon 4x4 open jeep safari and visit to Kaziranga Orchid Park."},{"day":7,"title":"Kaziranga to Bhalukpong / Tezpur Cultural Tour","description":"Drive along the foothills of Arunachal Pradesh. Visit ancient Tezpur Agnigarh ruins and Mahabhairab Temple. Evening traditional Assamese Bihu cultural dance performance."},{"day":8,"title":"Guwahati Brahmaputra Cruise & Airport Departure","description":"Drive back to Guwahati. Brief Brahmaputra riverfront visit and timely transfer to Guwahati Airport for your flight back home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-rajasthan',
  'dom-rajasthan',
  'domestic',
  'Domestic Tours',
  'Rajasthan',
  'Jaipur, Jodhpur, Jaisalmer & Udaipur',
  '₹48,000',
  48000,
  '6N/7D',
  '2026-06-01',
  4.9,
  356,
  ARRAY['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1521133573892-e44906baee46?w=1000&h=700&fit=crop']::text[],
  '6N/7D royal heritage circuit across Jaipur, Jodhpur, Jaisalmer & Udaipur.',
  'The Land of Kings — golden desert sands of Jaisalmer, majestic forts of Jaipur and Jodhpur, romantic lake palaces of Udaipur, camel safaris, and vibrant royal Rajput heritage.',
  ARRAY['Jaipur Amber Fort Elephant / Jeep Ride & Hawa Mahal', 'Jaisalmer Sam Sand Dunes Luxury Swiss Tent Camp with DJ & Bonfire', 'Sunset Camel Safari & Thar Desert 4x4 Dune Bashing', 'Mehrangarh Fort Guided Tour & Jodhpur Blue City Walk', 'Udaipur Lake Pichola Boat Ride & Royal City Palace Complex', 'Authentic Rajasthani Chokhi Dhani Cultural Village Feast']::text[],
  '[{"day":1,"title":"Arrival in Jaipur (Pink City) & Chokhi Dhani","description":"Arrive at Jaipur Airport / Station. Check into heritage hotel. Evening visit Chokhi Dhani ethnic resort for Rajasthani folk dances, camel rides, puppet shows, and authentic thali feast."},{"day":2,"title":"Jaipur Forts, Palaces & Hawa Mahal","description":"Ascend Amber Fort on elephant / jeep. Photo stop at Jal Mahal. Visit City Palace royal museum, Jantar Mantar UNESCO observatory, and iconic Hawa Mahal (Palace of Winds)."},{"day":3,"title":"Jaipur to Jodhpur (Blue City) via Pushkar","description":"Drive to Jodhpur via holy Pushkar. Visit sacred Brahma Temple and holy Pushkar Lake. Continue to Jodhpur, check into heritage haveli hotel."},{"day":4,"title":"Mehrangarh Fort & Drive to Jaisalmer Dunes","description":"Tour the invincible Mehrangarh Fort and Jaswant Thada marble cenotaph. Scenic drive across Thar Desert to Jaisalmer Sam Sand Dunes. Luxury Swiss tent check-in, camel safari, and cultural gala."},{"day":5,"title":"Jaisalmer Golden Fort & Kuldhara Haunted Village","description":"Explore living Jaisalmer Golden Fort (Sonar Qila), Patwon Ki Haveli, Salim Singh Ki Haveli, and eerie Kuldhara abandoned haunted village."},{"day":6,"title":"Jaisalmer to Udaipur (City of Lakes)","description":"Drive to romantic Udaipur via Ranakpur Jain Temples with 1,444 uniquely carved marble pillars. Arrive in Udaipur, evening sunset boat ride on Lake Pichola past Lake Palace."},{"day":7,"title":"Udaipur City Palace & Airport Departure","description":"Visit majestic Udaipur City Palace complex, Saheliyon Ki Bari, and Jagdish Temple. Timely transfer to Udaipur Airport / Railway Station for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'dom-sikkim',
  'dom-sikkim',
  'domestic',
  'Domestic Tours',
  'Sikkim',
  'Gangtok, Lachen, Lachung & Pelling, Sikkim',
  '₹54,000',
  54000,
  '7N/8D',
  '2026-06-15',
  4.9,
  230,
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '7N/8D high-altitude wonderland across Gangtok, Lachen, Lachung & Pelling.',
  'The Himalayan kingdom of glaciers and monasteries — holy Tsomgo Lake, sacred Gurudongmar Lake at 17,800ft, Yumthang Valley of Flowers, and spellbinding views of Mount Kanchenjunga.',
  ARRAY['Gurudongmar Holy Lake at 17,800ft — One of the Highest Lakes in the World', 'Tsomgo (Changu) Glacial Lake & Baba Harbhajan Singh Mandir', 'Yumthang Valley of Flowers & Shingba Rhododendron Sanctuary', 'Pelling Skywalk & Spectacular Kanchenjunga Sunrise View', 'Rumtek Monastery & Enchey Monastery Buddhist Circuits', 'Lachen & Lachung Remote Alpine Village Wooden Homestays']::text[],
  '[{"day":1,"title":"Bagdogra Arrival & Scenic Drive to Gangtok","description":"Arrive at Bagdogra Airport (IXB) / NJP Railway Station. Scenic drive alongside Teesta River into Sikkim capital Gangtok. Evening stroll on MG Marg pedestrian mall."},{"day":2,"title":"Tsomgo Glacial Lake & Baba Mandir","description":"Excursion to sacred Tsomgo Lake (12,400ft) surrounded by snow-capped mountains. Visit Baba Harbhajan Singh Memorial Temple and enjoy yak rides along the lake."},{"day":3,"title":"Gangtok to Lachen via Chungthang Waterfalls","description":"Scenic drive to North Sikkim village of Lachen (8,830ft). Stop at Seven Sisters Waterfalls, Naga Falls, and Singhik Viewpoint. Overnight in peaceful alpine wooden lodge."},{"day":4,"title":"Gurudongmar Lake (17,800ft) & Lachung","description":"Early morning expedition to sacred Gurudongmar Lake at 17,800ft with crystal blue frozen waters. Return to Lachen, lunch, and drive to picturesque Lachung village."},{"day":5,"title":"Yumthang Valley of Flowers & Return to Gangtok","description":"Visit Yumthang Valley (11,800ft) blooming with wild rhododendrons and alpine hot springs. Optional Zero Point snow excursion. Return drive to Gangtok hotel."},{"day":6,"title":"Gangtok to Pelling via Ravangla Buddha Park","description":"Drive to Pelling in West Sikkim. En route visit the breathtaking Tathagata Tsal (Buddha Park) with 130ft Buddha statue set against Himalayan peaks. Check-in in Pelling."},{"day":7,"title":"Pelling Glass Skywalk & Pemayangtse Monastery","description":"Visit Pelling Glass Skywalk, Chenrezig Statue, Pemayangtse Monastery, Rabdentse Palace ruins, and Kanchenjunga Waterfalls with majestic sunrise view of Mt. Kanchenjunga."},{"day":8,"title":"Pelling to Bagdogra / NJP Departure","description":"Breakfast with panoramic mountain views. Scenic descent through tea gardens to Bagdogra Airport / NJP Station for return flight."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'mtn-manali-leh',
  'mtn-manali-leh',
  'mountain',
  'Mountain Expeditions',
  'Manali – Leh Biking Expedition',
  'Manali – Jispa – Sarchu – Leh – Nubra',
  '₹38,500',
  38500,
  '8 Days / 7 Nights',
  '2026-06-15',
  4.9,
  188,
  ARRAY['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop']::text[],
  '8-day epic Himalayan biking expedition crossing Rohtang, Baralacha La & Tanglang La to Leh & Nubra.',
  'The definitive high-altitude motorcycle and biking odyssey across the Himalayas. Cross legendary high passes including Rohtang Pass, Baralacha La, Nakee La, Lachung La, and Tanglang La into the mystic moonscapes of Ladakh.',
  ARRAY['Ride through Atal Tunnel, Baralacha La (16,040ft) & Tanglang La (17,480ft)', 'Dramatic Gata Loops 21 hairpin bends & Morey Plains throttle run', 'Khardung La (18,380ft) world’s highest motorable pass crossing', 'Pangong Tso high-altitude turquoise lake ride & campsite', 'Dedicated backup vehicle, certified mechanic, oxygen & spares']::text[],
  '[{"day":1,"title":"Arrival in Manali & Briefing Session","description":"Assemble at Manali base camp, machine allocation, gear check, and orientation ride to Solang Valley."},{"day":2,"title":"Manali to Jispa via Atal Tunnel & Keylong","description":"Ride through the engineering wonder Atal Tunnel into Lahaul Valley. Cruise along Bhaga River to Jispa campsite (10,500ft)."},{"day":3,"title":"Jispa to Sarchu via Baralacha La & Deepak Tal","description":"Cross Deepak Tal & Suraj Tal lakes before tackling snowbound Baralacha La (16,040ft) to reach Sarchu plateau."},{"day":4,"title":"Sarchu to Leh via Gata Loops & Tanglang La","description":"Conquer the 21 hairpin bends of Gata Loops, Nakee La, Lachung La, and Tanglang La (17,480ft) descending into Leh."},{"day":5,"title":"Leh Acclimatization & Local Monasteries","description":"Rest and acclimatize in Leh. Explore Shanti Stupa, Leh Palace, Hall of Fame, and vibrant local bazaar."},{"day":6,"title":"Leh to Nubra Valley via Khardung La (18,380ft)","description":"Ascend the legendary Khardung La pass into the Valley of Flowers. Ride double-humped Bactrian camels at Hunder sand dunes."},{"day":7,"title":"Nubra to Pangong Tso Lake & Return to Leh","description":"Ride along the Shyok River to magical Pangong Tso lake (14,270ft). Spend time by the azure shores and ride back to Leh via Chang La."},{"day":8,"title":"Leh Airport Departure","description":"Farewell breakfast with the riding crew. Drop-off at Kushok Bakula Rimpochee Airport (IXL) for flight home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'mtn-leh-ladakh',
  'mtn-leh-ladakh',
  'mountain',
  'Mountain Expeditions',
  'Leh – Ladakh Biking Circuit',
  'Leh – Khardung La – Nubra – Turtuk – Pangong Tso',
  '₹36,000',
  36000,
  '7 Nights / 8 Days',
  '2026-07-05',
  5,
  212,
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop']::text[],
  '7N/8D ultimate Ladakh biking circuit covering Khardung La, Nubra, Turtuk, Pangong Tso & Chang La.',
  'Explore the Crown of the Himalayas on two wheels. A comprehensive circuit covering the high passes, ancient cliffside monasteries, Turtuk Balti village, and high-altitude lakes of Ladakh.',
  ARRAY['Conquer Khardung La (18,380ft) & Chang La (17,590ft)', 'Border village ride to Turtuk (Baltistan culture)', 'Stargazing at Pangong Tso high-altitude campsite', 'Magnetic Hill & Sangam (Indus & Zanskar confluence)', 'Thiksey & Diskit Monastery colossal Maitreya Buddha']::text[],
  '[{"day":1,"title":"Leh Arrival & Mandatory Acclimatization","description":"Arrive at Leh Airport (11,562ft). Full day rest for high-altitude acclimatization. Evening light walk around Leh Market."},{"day":2,"title":"Leh Local, Shey & Thiksey Monasteries","description":"Test ride along Indus River to Shey Palace, 12-storey Thiksey Monastery, and sunset from Shanti Stupa."},{"day":3,"title":"Leh to Nubra Valley via Khardung La (18,380ft)","description":"Ascend the world''s highest motorable pass Khardung La. Descend into Nubra Valley and explore Diskit Monastery and Hunder Dunes."},{"day":4,"title":"Nubra Valley to Turtuk Village & Back to Hunder","description":"Ride to India’s northernmost outpost Turtuk in Baltistan along the LOC. Experience apricot orchards and Balti cuisine."},{"day":5,"title":"Nubra Valley to Pangong Tso via Shyok River","description":"Ride through dramatic gorges along the Shyok River directly to Pangong Tso lake (14,270ft). Overnight camping near the lake."},{"day":6,"title":"Pangong Tso Sunrise & Ride to Leh via Chang La","description":"Witness color-shifting sunrise over Pangong lake. Ride over Chang La pass (17,590ft) back to Leh."},{"day":7,"title":"Leh Valley, Magnetic Hill, Gurudwara & Sangam","description":"Ride to the gravity-defying Magnetic Hill, Gurudwara Pathar Sahib, and the dramatic Indus-Zanskar Sangam confluence."},{"day":8,"title":"Leh Airport Departure","description":"Check-out from Leh hotel and transfer to airport with lifetime memories of the trans-Himalayan ride."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'mtn-winter-spiti',
  'mtn-winter-spiti',
  'mountain',
  'Mountain Expeditions',
  'Winter Spiti Expedition',
  'Shimla – Sangla – Kalpa – Tabo – Kaza – Hikkim – Kibber',
  '₹34,500',
  34500,
  '10 Days / 9 Nights',
  '2026-12-15',
  4.9,
  164,
  ARRAY['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop']::text[],
  '10-day winter expedition across frozen Spiti Valley, Kaza, Key Monastery & snow-bound villages.',
  'The ultimate white winter expedition into the frozen wonderland of Spiti Valley. Drive over snow-clad Himalayan terrain, witness frozen waterfalls, encounter Himalayan wildlife, and stay in warm local homestays.',
  ARRAY['Frozen Spiti Valley landscapes and snow leopard habitat zones', 'Century-old Key Monastery perched like a fortress in snow', 'World’s highest post office at Hikkim & highest village at Komic', 'Traditional heated homestays with warm Spitian hospitality', 'Experienced mountain 4x4 drivers with snow chains']::text[],
  '[{"day":1,"title":"Shimla Arrival & Scenic Drive to Narkanda","description":"Arrive in Shimla, drive into the apple bowl of Narkanda. Check-in and enjoy panoramic snow vistas of Hatu Peak."},{"day":2,"title":"Narkanda to Sangla / Chitkul in Kinnaur","description":"Descend along the roaring Sutlej River through Kinnaur Gate to the fairy-tale valley of Sangla and India’s last village Chitkul."},{"day":3,"title":"Chitkul to Kalpa with Kinner Kailash View","description":"Drive to Kalpa village. Marvel at the sacred 6,050m Kinner Kailash peak changing colors during sunset."},{"day":4,"title":"Kalpa to Nako & 1000-Year Tabo Monastery","description":"Enter the cold desert terrain of Spiti. Visit frozen Nako Lake and the UNESCO World Heritage Tabo Monastery complex."},{"day":5,"title":"Tabo to Kaza via Cliffside Dhankar Monastery","description":"Drive to Dhankar Monastery perched on a dramatic cliff overlooking Spiti & Pin river confluence. Arrive in winter capital Kaza."},{"day":6,"title":"Kaza - Key Monastery & Kibber Snow Expedition","description":"Visit snow-covered Key Monastery and Kibber village (14,200ft) known as prime Snow Leopard territory. Tea with monks."},{"day":7,"title":"Kaza - Hikkim, Komic & Langza Fossil Village","description":"Visit Hikkim (world’s highest post office), Komic (highest motorable village), and the giant Buddha statue at Langza."},{"day":8,"title":"Kaza Snow Safari & Local Homestay Experience","description":"Excursion through Chicham Bridge (highest suspension bridge in Asia) and immerse in warm Spitian homestay culinary traditions."},{"day":9,"title":"Kaza to Kalpa / Rampur Return Journey","description":"Begin return drive through the scenic trans-Himalayan gorge roads. Overnight stay in Kalpa or Rampur."},{"day":10,"title":"Drive to Shimla / Chandigarh Departure","description":"Scenic drive back to Shimla/Chandigarh railway station or airport for return journey home."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'mtn-mountaineering-expedition',
  'mtn-mountaineering-expedition',
  'mountain',
  'Mountain Expeditions',
  'Mountaineering Expedition',
  'Garhwal Himalayas, Uttarakhand',
  '₹42,000',
  42000,
  '8 Days / 7 Nights',
  '2026-08-10',
  4.9,
  94,
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&h=700&fit=crop']::text[],
  '8-day technical alpine mountaineering expedition with certified UIAGM guides & glacier training.',
  'A serious alpine mountaineering program designed for aspiring climbers and peak baggers. Learn glacier navigation, ice-axe arrest, crevasse rescue, and push for a high Himalayan summit ridge.',
  ARRAY['Technical glacier traverse, rope-team coordination & ice craft', 'Certified IMF / UIAGM lead mountain instructors', 'Summit ridge attempt with 360-degree Himalayan views', 'High-altitude alpine dome expedition tents & nutritious meals', 'Full mountaineering certification upon successful completion']::text[],
  '[{"day":1,"title":"Base Camp Assembly & Gear Check","description":"Assemble at roadhead base camp, gear inspection, harness fitment, and briefing by expedition leader."},{"day":2,"title":"Acclimatization Hike & Technical Training","description":"Gradual ascent to intermediate ridge. Practice knot-tying, rope coordination, and high-altitude breathing techniques."},{"day":3,"title":"Ascend to Camp 1 (13,500ft)","description":"Trek through alpine moraine to establish Camp 1. Set up high-altitude four-season dome tents."},{"day":4,"title":"Glacier Traverse & Ice Climbing Drills","description":"Rope up on the glacier. Hands-on training on crampon technique, front-pointing, and self-arrest with ice axes."},{"day":5,"title":"Push to Advance Base Camp (15,200ft)","description":"Ascent to Advance Base Camp beneath the summit pyramid. Early evening carb-loading dinner and rest."},{"day":6,"title":"Summit Ridge Push & Descend to Camp 1","description":"Midnight alpine start for the summit push. Reach the summit ridge at sunrise. Celebrate and safely descend to Camp 1."},{"day":7,"title":"Return to Base Camp & Celebration","description":"Trek down to main Base Camp. Debriefing session, certificate distribution, and celebratory campfire dinner."},{"day":8,"title":"Debrief & Departure","description":"Farewell breakfast with instructors and mountain crew before transfer to nearest railway station."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'mtn-trekking-camping',
  'mtn-trekking-camping',
  'mountain',
  'Mountain Expeditions',
  'Mountain Trekking & Alpine Camping',
  'Himachal & Uttarakhand Ranges',
  '₹14,500',
  14500,
  '6 Days / 5 Nights',
  '2026-05-20',
  4.8,
  145,
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&h=700&fit=crop']::text[],
  '6-day scenic alpine trek with riverside wild camping, ridge walking & starry nights.',
  'A classic wilderness trek through lush pine forests, bubbling glacial streams, blooming rhododendron meadows, and panoramic Himalayan viewpoints. Perfect for nature lovers and avid hikers.',
  ARRAY['Lush alpine meadows (Bugyals) and dense cedar forests', 'Spectacular 360° panoramic sunrise views of snow ranges', 'Wilderness riverside camping beneath starry constellations', 'Experienced trek leaders, camp cooks & medical kits', 'Clean eco-friendly camping following Leave No Trace principles']::text[],
  '[{"day":1,"title":"Base Town Arrival & Scenic Drive to Trailhead","description":"Assemble at base town, scenic mountain drive to the starting village trailhead. Camp orientation and evening acclimatization walk."},{"day":2,"title":"Trek through Pine Forests to Alpine Meadow Camp","description":"Ascend through fragrant pine, oak, and deodar forests alongside gushing mountain streams. Pitch tents in scenic meadow."},{"day":3,"title":"Ridge Trail to High Glacial Ridge Camp","description":"Climb above tree line onto the open ridges. Enjoy uninterrupted vistas of towering snow-capped peaks."},{"day":4,"title":"Summit Viewpoint Trek & Sunset Campfire","description":"Trek to highest panoramic viewpoint. Enjoy lunch with 360-degree mountain horizons. Evening stargazing and campfire stories."},{"day":5,"title":"Descent through Alpine Valleys to Base Village","description":"Gradual descent through picturesque mountain hamlets and terraced fields. Return to base camp lodge."},{"day":6,"title":"Farewell Breakfast & Departure Transfer","description":"Hearty breakfast with fellow trekkers before departure transfers to transport hub."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-brahmatal',
  'adv-brahmatal',
  'adventure',
  'Adventure Tours & Camps',
  'Brahmatal Snow Trek',
  'Lohajung – Bekaltal – Brahmatal – Rishikesh',
  '₹15,500',
  15500,
  '9 Days / 8 Nights',
  '2026-12-10',
  4.9,
  176,
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '9-day classic winter snow trek to frozen Brahmatal Lake (12,250ft) with panoramic Himalayan views.',
  'One of the finest winter snow treks in the Himalayas offering grand views of Mt. Trishul and Nanda Ghunti reflecting on the frozen Brahmatal Lake. Walk along snowy ridgelines and camp under starry mountain skies.',
  ARRAY['Frozen glacial lake of Brahmatal nestled at 12,250ft', 'Unmatched close-up vistas of Mt. Trishul (7,120m) & Nanda Ghunti', 'Snow-covered rhododendron and silver oak forests', 'Ridge walking along snow-laden trails', 'Ganges river rafting in Rishikesh on return leg']::text[],
  '[{"day":1,"title":"Rishikesh to Lohajung Base Village Drive","description":"Scenic 10-hour drive along the Alaknanda and Mandakini rivers through Devprayag and Karnaprayag to Lohajung (7,600ft)."},{"day":2,"title":"Lohajung to Bekaltal Camp via Oak Forests","description":"Trek 6km through enchanting oak and rhododendron forests with views of Wan village. Camp by the peaceful Bekaltal lake."},{"day":3,"title":"Bekaltal to Brahmatal Camp with Trishul Views","description":"Ascend through forest trails opening into expansive snow meadows. Majestic views of Mt. Trishul as you reach Brahmatal camp (10,440ft)."},{"day":4,"title":"Brahmatal Summit Push (12,250ft) & Khorurai","description":"Early morning climb to Brahmatal Pass and frozen lake. 360-degree panorama of Trishul, Nanda Ghunti, and Chaukhamba. Descend to Khorurai."},{"day":5,"title":"Khorurai to Lohajung Descent","description":"Trek back down through oak trees into Lohajung base village. Evening hot showers, celebration dinner, and rest."},{"day":6,"title":"Lohajung Rest & Local Village Exploration","description":"Leisure day in Lohajung. Visit local mountain homes, explore traditional Garhwali culture, and witness alpine sunsets."},{"day":7,"title":"Lohajung to Auli / Joshimath Excursion","description":"Scenic drive to Joshimath and Auli. Enjoy views of Nanda Devi peak and explore the Himalayan ropeway viewpoints."},{"day":8,"title":"Joshimath to Rishikesh via Devprayag Sangam","description":"Drive back along the sacred river valleys. Stop at Devprayag (confluence of Bhagirathi and Alaknanda). Check-in at Rishikesh."},{"day":9,"title":"Rishikesh River Rafting & Departure","description":"Morning white water rafting on the Ganges through rapids like Roller Coaster and Golf Course. Departure transfer."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-kedarkantha',
  'adv-kedarkantha',
  'adventure',
  'Adventure Tours & Camps',
  'Kedarkantha Snow Summit Trek',
  'Dehradun – Sankri – Juda Ka Talab – Kedarkantha – Tons River',
  '₹14,500',
  14500,
  '9 Days / 8 Nights',
  '2026-11-25',
  4.9,
  240,
  ARRAY['https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '9-day winter trek to Kedarkantha Summit (12,500ft) with frozen lake camping and Tons river adventure.',
  'The quintessential winter wonderland trek. Climb to the dramatic pyramid summit of Kedarkantha at 12,500ft, camp beside the frozen Juda Ka Talab lake, and gaze upon 13 prominent Himalayan peaks.',
  ARRAY['360° summit views of Swargarohini, Black Peak, Bandarpoonch', 'Juda Ka Talab — magical frozen alpine lake campsite', 'Snow sliding and descent through untouched winter powder', 'Traditional wooden architecture homestay in Sankri village', 'Tons River pine valley riverside camping experience']::text[],
  '[{"day":1,"title":"Dehradun to Sankri Base Village Drive","description":"Scenic drive through Mussoorie, Nainbagh, Purola, and Mori along the Tons River into Govind National Park base Sankri (6,400ft)."},{"day":2,"title":"Sankri to Juda Ka Talab Frozen Lake Camp","description":"Trek 4km through dense pine and maple forests. Arrive at the mystical frozen lake Juda Ka Talab (9,100ft) surrounded by tall pine trees."},{"day":3,"title":"Juda Ka Talab to Kedarkantha Base Camp","description":"Trek through clearing meadows to Kedarkantha Base Camp (11,250ft). Striking sunset views of the snow-clad summit pyramid."},{"day":4,"title":"Kedarkantha Summit (12,500ft) Sunrise & Hargaon","description":"Early 3:30 AM summit push. Reach summit for glowing Himalayan sunrise over Swargarohini & Bandarpoonch. Descend to Hargaon camp."},{"day":5,"title":"Hargaon to Sankri Village Descent","description":"Descend through apple orchards and pine groves back to Sankri base village. Rest and celebrate summit success."},{"day":6,"title":"Sankri to Mori White River Campsite","description":"Drive along the picturesque Tons Valley to Mori riverside camps. Enjoy evening campfire along the roaring mountain river."},{"day":7,"title":"Adventure Activities & Forest Trail at Tons River","description":"Enjoy river crossing, valley nature trail, pine cone craft workshops, and riverside outdoor relaxation."},{"day":8,"title":"Scenic Drive to Mussoorie / Dehradun","description":"Scenic drive stopping at Kempty Falls in Mussoorie. Check-in at Dehradun hotel for evening leisure."},{"day":9,"title":"Dehradun Sightseeing & Departure","description":"Visit Robber’s Cave and Tapkeshwar Temple before departing from Dehradun Railway Station or Jolly Grant Airport."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-chopta-rishikesh',
  'adv-chopta-rishikesh',
  'adventure',
  'Adventure Tours & Camps',
  'Chopta – Rishikesh Adventure',
  'Rishikesh – Sari – Deoriatal – Chopta – Tungnath – Chandrashila',
  '₹18,500',
  18500,
  '9 Days / 8 Nights',
  '2026-05-15',
  4.8,
  198,
  ARRAY['https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop']::text[],
  '9-day combo of Chandrashila summit (13,100ft), Deoriatal lake, Ganga white water rafting & bungee.',
  'The ultimate blend of high-altitude Himalayan trekking and roaring river adrenaline. Trek to Tungnath (world’s highest Shiva temple) and Chandrashila Summit (13,100ft), followed by world-class rafting and bungee jumping in Rishikesh.',
  ARRAY['Tungnath Temple (12,073ft) — world’s highest Shiva shrine', 'Chandrashila Summit (13,100ft) with Chaukhamba panorama', 'Deoriatal reflection of snow peaks in crystal clear waters', '24km Class III/IV Ganges white water rafting expedition', 'India’s premier 83m bungee jump & giant canyon swing']::text[],
  '[{"day":1,"title":"Haridwar/Rishikesh Arrival & Camp Check-in","description":"Assemble at Rishikesh / Haridwar, transfer to riverside adventure camp in Shivpuri. Welcome drink & evening campfire."},{"day":2,"title":"Rishikesh White Water Rafting & Cliff Jumping","description":"Hit the rapids from Marine Drive to NIM Beach (16km). Enjoy cliff jumping into the pristine waters of the Ganga."},{"day":3,"title":"Rishikesh to Sari Village & Deoriatal Trek","description":"Drive along Alaknanda River to Sari village. Trek 2.5km to Deoriatal Lake with breathtaking reflections of Mt. Chaukhamba."},{"day":4,"title":"Deoriatal to Chopta Base Camp Meadows","description":"Trek / transfer across the scenic rhododendron ridges to Chopta (8,790ft), known as the Mini Switzerland of Uttarakhand."},{"day":5,"title":"Tungnath Temple & Chandrashila Summit (13,100ft)","description":"Early trek to ancient Tungnath temple and continue to Chandrashila summit for an astonishing 360° panorama of Garhwal Himalayas."},{"day":6,"title":"Chopta to Kund / Rudraprayag Scenic Valley","description":"Descend to Mandakini Valley. Visit ancient temples and relax in scenic riverside eco-resorts."},{"day":7,"title":"Drive to Rishikesh via Ganga Valleys","description":"Scenic return drive along the holy rivers. Check-in to luxury riverside resort. Evening visit to Beatles Ashram."},{"day":8,"title":"Bungee Jump, Giant Swing & Triveni Ghat Aarti","description":"Experience adrenaline rush at Mohan Chatti (Bungee Jump / Flying Fox). Evening soul-stirring Ganga Aarti at Triveni Ghat."},{"day":9,"title":"Morning Yoga & Departure","description":"Early morning riverside meditation and yoga session, wholesome breakfast, and transfer for onward journey."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-manali-kasol',
  'adv-manali-kasol',
  'adventure',
  'Adventure Tours & Camps',
  'Manali – Kasol Backpacking Trail',
  'Manali – Solang – Atal Tunnel – Kasol – Tosh – Kheerganga',
  '₹16,500',
  16500,
  '10 Days / 9 Nights',
  '2026-06-01',
  4.8,
  289,
  ARRAY['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&h=700&fit=crop']::text[],
  '10-day backpacker circuit covering Manali, Solang, Atal Tunnel, Kasol, Tosh, Chalal & Kheerganga trek.',
  'The ultimate Himachal backpacking journey through the hippie cafes of Old Manali, the bohemian vibes of Parvati Valley, the natural hot sulfur springs of Kheerganga, and the mystic apple orchards of Tosh.',
  ARRAY['Kheerganga summit trek & natural hot water sulfur spring bath', 'Parvati Valley cafe hopping, Israeli food & live music', 'Fairy-tale mountain hamlets of Tosh, Chalal & Malana view', 'Drive through Atal Tunnel into scenic Lahaul Sissu waterfalls', 'Hadimba temple forest & Old Manali bohemian alleys']::text[],
  '[{"day":1,"title":"Delhi to Manali Overnight Journey / Arrival","description":"Overnight journey into the Beas Valley. Arrive in Manali, check-in to riverside backpacker lodge and unwind."},{"day":2,"title":"Manali Local & Old Manali Cafe Hopping","description":"Explore Hadimba Temple, Manu Temple, Van Vihar, and stroll through the quirky wooden cafes of Old Manali."},{"day":3,"title":"Solang Valley & Atal Tunnel Excursion","description":"Drive through the Atal Tunnel to Sissu waterfall in Lahaul Valley. Afternoon adventure sports at Solang Valley."},{"day":4,"title":"Jogini Waterfall Hike & Vashisht Hot Springs","description":"Trek through pine woods to Jogini Waterfalls. Visit ancient Vashisht village for natural thermal sulfur baths."},{"day":5,"title":"Manali to Kasol Parvati Valley Transfer","description":"Scenic drive into the mystic Parvati Valley. Check into Kasol riverside stay. Stroll around Kasol market and riverside cafes."},{"day":6,"title":"Kasol to Tosh Village & Waterfall Trek","description":"Drive to Barshaini and trek up to the cliffside village of Tosh (7,874ft). Experience panoramic views of Tosh glacier peaks."},{"day":7,"title":"Kasol to Chalal Nature Walk & Cafe Culture","description":"Cross the iconic Kasol suspension bridge for a peaceful walk along the Parvati River to Chalal village. Evening acoustic jamming."},{"day":8,"title":"Kheerganga Trek & Natural Hot Spring Bath","description":"12km trek through roaring waterfalls and dense oak forests to Kheerganga (9,711ft). Soak in the rejuvenating natural hot springs."},{"day":9,"title":"Kheerganga to Kasol Descent & Manikaran Sahib","description":"Descend to Barshaini and visit the historic Gurudwara Shri Manikaran Sahib hot springs. Return to Kasol for farewell party."},{"day":10,"title":"Kasol to Delhi / Chandigarh Departure","description":"Leisurely cafe breakfast, souvenir shopping for local handicrafts, and evening boarding for onward journey."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-jaisalmer',
  'adv-jaisalmer',
  'adventure',
  'Adventure Tours & Camps',
  'Jaisalmer Desert Adventure Camp',
  'Jaisalmer – Sam Sand Dunes – Kuldhara – Thar Desert',
  '₹11,500',
  11500,
  '4 Nights / 3 Days',
  '2026-11-01',
  4.8,
  312,
  ARRAY['https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1521133573892-e44906baee46?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop']::text[],
  '4 Nights / 3 Days Thar desert camp experience with jeep safari, camel ride, dune bashing & folk dance.',
  'An exhilarating desert safari across the golden sand dunes of the Thar. Enjoy dune bashing in 4x4 open jeeps, sunset camel safaris, starlit luxury desert camping, quad biking, and authentic Rajasthani cultural folk evenings.',
  ARRAY['Sunset camel safari & deep dune bashing in 4x4 open jeeps', 'Luxury Swiss desert tents in Sam Sand Dunes with private washrooms', 'Nightly Rajasthani Kalbeliya dance, folk songs & campfire dinner', 'Guided tour of living Golden Fort (Sonar Qila) & Patwon Ki Haveli', 'Ghost village exploration at abandoned Kuldhara heritage site']::text[],
  '[{"day":1,"title":"Jaisalmer Golden City Arrival & Fort Tour","description":"Arrive in Jaisalmer, check into heritage city hotel. Explore the UNESCO living Golden Fort (Sonar Qila) and Gadisar Lake."},{"day":2,"title":"Patwon Ki Haveli & Drive to Sam Sand Dunes Camp","description":"Visit intricately carved Patwon Ki Haveli, Salim Singh Haveli, and the haunted village of Kuldhara. Drive to Sam Sand Dunes camp. Sunset camel ride."},{"day":3,"title":"Thar Desert Dune Bashing, Quad Biking & Folk Night","description":"Thrilling 4x4 open jeep safari across undulating sand dunes. Optional quad biking. Evening vibrant Kalbeliya folk music, fire dance & gala dinner."},{"day":4,"title":"Morning Desert Sunrise Walk & Departure","description":"Experience golden desert sunrise over sand ripples, traditional Rajasthani breakfast, and transfer to Jaisalmer station/airport."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-saputara',
  'adv-saputara',
  'adventure',
  'Adventure Tours & Camps',
  'Saputara Weekend Hill & Forest Adventure',
  'Saputara – Dang Forest – Gira Waterfalls',
  '₹5,500',
  5500,
  '3 Days / 2 Nights',
  '2026-07-20',
  4.7,
  142,
  ARRAY['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&h=700&fit=crop']::text[],
  '3 Days / 2 Nights adventure getaway in Saputara with waterfalls, trekking, boating & ropeway.',
  'A refreshing weekend escape to Gujarat’s only hill station nestled in the Sahyadri ranges. Experience misty viewpoints, roaring waterfalls, adventure ropeways, governor hill trekking, and tranquil lake boating.',
  ARRAY['Breathtaking Gira Waterfalls in full monsoon flow', 'Governor Hill trek offering panoramic Sahyadri valley views', 'Saputara Lake boating & sunset point cable car ropeway', 'Tribal museum and Dang forest biodiversity walk', 'Adventure sports zone: zip-lining, wall climbing & zorbing']::text[],
  '[{"day":1,"title":"Arrival in Saputara, Sunset Point & Lake Boating","description":"Arrive in Saputara hill station. Check into resort. Enjoy paddle boating on Saputara Lake and cable car ride to Sunset Point."},{"day":2,"title":"Gira Waterfalls, Governor Hill Trek & Ropeway","description":"Morning excursion to the spectacular Gira Waterfalls in Dang forests. Afternoon trek to Governor Hill and adventure activity zone."},{"day":3,"title":"Sunrise Point, Step Garden & Return Departure","description":"Sunrise view from Sunrise Point / Table Land, visit Step Garden and Tribal Museum before departure with refreshing memories."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'adv-beyt-dwarka',
  'adv-beyt-dwarka',
  'adventure',
  'Adventure Tours & Camps',
  'Beyt Dwarka Marine & Island Camp',
  'Dwarka – Okha – Beyt Dwarka – Dunny Point',
  '₹6,500',
  6500,
  '3 Days / 2 Nights',
  '2026-10-15',
  4.8,
  184,
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&h=700&fit=crop']::text[],
  '3 Days / 2 Nights marine adventure camp at Beyt Dwarka with coral walks, dolphin spotting & island camping.',
  'An extraordinary coastal marine adventure on the Gulf of Kutch. Walk across live coral reefs during low tide, spot wild dolphins leaping in open seas, camp on isolated golden beach shores, and explore underwater marine biodiversity.',
  ARRAY['Live coral reef walk observing sea anemones, octopus & corals', 'Open-sea boat safari with wild dolphin sightings', 'Island beach camping at secluded Dunny Point', 'Stargazing and campfire night along the Arabian Sea coast', 'Visit to ancient Beyt Dwarkadhish temple and Sudama Bridge']::text[],
  '[{"day":1,"title":"Arrival at Okha & Boat to Beyt Dwarka Island Camp","description":"Assemble at Okha / Dwarka. Take a scenic ferry ride across the Gulf to Beyt Dwarka island. Check into beach tents. Sunset beach games and campfire."},{"day":2,"title":"Marine Life Exploration, Coral Walk & Snorkeling","description":"Low-tide guided coral walk at Dunny Point. Observe vibrant live corals, sea sponges, starfish, and pufferfish. Evening dolphin spotting session."},{"day":3,"title":"Dolphin Safari, Dwarkadhish Temple & Departure","description":"Early morning dolphin spotting boat cruise. Visit sacred Beyt Dwarkadhish Temple and Sudama Setu before return transfer."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'fam-gir-nature',
  'fam-gir-nature',
  'family',
  'Family Tours',
  'Gir Nature Education & Family Camp',
  'Sasan Gir National Park – Junagadh, Gujarat',
  '₹6,800',
  6800,
  '2 Nights / 3 Days',
  '2026-11-10',
  4.9,
  215,
  ARRAY['https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&h=700&fit=crop']::text[],
  '2 Nights / 3 Days Gir nature education & family camp with Asiatic lion safari, nature trails & certificate.',
  'An enriching wildlife and nature education camp in the heart of Sasan Gir — the last global sanctuary of the Asiatic Lion. Designed for children, parents, and families with wildlife safaris, bird-watching, wilderness workshops, and recognized participation certificates.',
  ARRAY['Open Gypsy Safari inside Gir National Park to spot Asiatic Lions', 'Official Nature Education & Wildlife Camp Participation Certificate', 'Interactive nature workshops, pugmark casting & bird watching', 'Stay in eco-friendly nature camp resort with swimming pool & lawns', 'Cultural Siddi Dhamal tribal dance & campfire evening']::text[],
  '[{"day":1,"title":"Arrival at Gir National Park & Orientation","description":"Arrive at Sasan Gir eco-resort. Check-in and welcome drink. Afternoon orientation, nature education audio-visual briefing, and interactive bird-watching trail."},{"day":2,"title":"Open Gypsy Lion Safari & Nature Workshop","description":"Early morning open Gypsy Safari in Gir National Park deep jungle zones to spot Asiatic lions, leopards, and spotted deer. Afternoon pugmark casting workshop and evening Siddi tribal dance around campfire."},{"day":3,"title":"Nature Trail Walk, Certificate Ceremony & Departure","description":"Early morning guided botanical and butterfly walk along Hiran River. Official Nature Education Certificate distribution ceremony and farewell lunch before departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'fam-gir-camping',
  'fam-gir-camping',
  'family',
  'Family Tours',
  'Gir Family Camping & Safari',
  'Sasan Gir – Devalia Safari Park, Gujarat',
  '₹3,900',
  3900,
  '1 Night / 2 Days',
  '2026-10-25',
  4.8,
  138,
  ARRAY['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1000&h=700&fit=crop']::text[],
  '1 Night / 2 Days family weekend camping at Sasan Gir with Devalia lion safari & campfire.',
  'A cozy overnight wilderness getaway for families and nature enthusiasts. Enjoy mango orchard camping, Devalia Safari Park excursion, evening stargazing, and delicious organic farm food.',
  ARRAY['Devalia Safari Park lion & wildlife sighting guaranteed', 'Camping in scenic Kesar mango orchard tents', 'Authentic wood-fired Kathiyawadi dinner with Bajra Rotla & Ringna No Olo', 'Night stargazing session and campfire family games', 'Crocodile breeding center & Hiran river nature trail']::text[],
  '[{"day":1,"title":"Gir Resort Arrival, Devalia Safari & Campfire","description":"Arrive at Gir mango orchard campsite by 12 PM. Lunch and afternoon safari at Devalia Safari Park. Evening campfire with music, Kathiyawadi feast, and stargazing."},{"day":2,"title":"Morning Jungle Trail, Crocodile Centre & Departure","description":"Morning guided bird watching walk along river banks, visit Crocodile Rearing Centre, hearty breakfast, and check-out with fond memories."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'fam-customized',
  'fam-customized',
  'family',
  'Family Tours',
  'Family & Customized Holiday Escapes',
  'Customized (India & International Destinations)',
  '₹45,000',
  45000,
  '6 Days / 5 Nights',
  '2026-06-10',
  5,
  310,
  ARRAY['https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&h=700&fit=crop']::text[],
  '6-day fully customizable private holiday tailored for families with dedicated concierge & chauffeur.',
  'A completely bespoke family vacation tailored to your pace, preferences, and interests. Whether relaxing in luxury heritage palaces, unwinding on private beaches, or exploring scenic hill stations, every moment is crafted for family togetherness.',
  ARRAY['Bespoke private itinerary customized to all age groups', 'Dedicated private chauffeur and luxury vehicle at disposal', 'Handpicked 4-star & 5-star family-friendly resorts and villas', 'Flexible meal plans catering to dietary requirements and kids menus', '24/7 dedicated trip concierge and on-ground support']::text[],
  '[{"day":1,"title":"Welcome & Tailored City Arrival with Private Chauffeur","description":"VIP airport / railway station pickup in private luxury vehicle. Check-in to handpicked family resort, welcome drinks, and evening leisure stroll."},{"day":2,"title":"Curated Family Heritage & Interactive Theme Tour","description":"Explore iconic landmarks with private family-friendly guide. Interactive cultural visits, kid-friendly museums, and scenic viewpoints."},{"day":3,"title":"Scenic Countryside Excursion & Cultural Workshops","description":"Scenic drive to picturesque natural attractions. Hands-on local pottery, chocolate making, or traditional cooking workshop for all ages."},{"day":4,"title":"Private Family Leisure Day & Resort Recreation","description":"A relaxed day at your own pace. Enjoy resort spa facilities, swimming pools, private garden games, and customized afternoon outings."},{"day":5,"title":"Sunset Cruise / Wildlife Safari & Gala Family Dinner","description":"Special family experience: scenic sunset boat cruise or wildlife safari, followed by a celebratory multi-course family gala dinner."},{"day":6,"title":"Souvenir Shopping & Seamless Airport Transfer","description":"Leisurely brunch, curated local market shopping for souvenirs and handicrafts, and smooth private transfer to airport."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'solo-trekking',
  'solo-trekking',
  'solo',
  'Go Solo',
  'Solo Trekking & High-Pass Trail',
  'Himalayan Ridge Trails, Himachal / Uttarakhand',
  '₹13,500',
  13500,
  '6 Days / 5 Nights',
  '2026-05-18',
  4.9,
  146,
  ARRAY['https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop']::text[],
  '6-day high-altitude solo trekking expedition through pine forests, glacial ridges & alpine camps.',
  'Find serenity, strength, and mindful connection on the high trails. Designed for independent explorers and solo trekkers with the safety of small curated groups, experienced mountain guides, and cozy campfire circles.',
  ARRAY['Cross high alpine mountain pass (14,000ft) with like-minded solo trekkers', 'Mindfulness, journaling sessions, and high-altitude solitude', 'Safe, small solo traveler community groups with certified guides', 'Single tent option available with no awkward sharing', 'Campfires, acoustic music, and stargazing in dark sky zones']::text[],
  '[{"day":1,"title":"Arrival at Base Camp & Solo Traveler Meetup","description":"Assemble at base town. Check into base lodge, introductory icebreaker circle with fellow solo travelers, gear check, and welcome dinner."},{"day":2,"title":"Ascent through Pine Forests to Alpine Ridge Camp","description":"Trek through aromatic deodar and pine woods alongside cascading mountain torrents. Pitch tents on scenic ridge."},{"day":3,"title":"High Mountain Pass Crossing (14,000ft) & Solo Reflection","description":"Early morning climb across the high mountain pass. Enjoy panoramic views of snow-clad Himalayan giants and peaceful personal reflection."},{"day":4,"title":"Glacial Stream Trail to Hidden Valley Sanctuary","description":"Descend into an untouched glacial valley filled with wildflowers and crystal streams. Wilderness camping under starry skies."},{"day":5,"title":"Descent to Mountain Hamlet & Campfire Community Night","description":"Trek down to traditional wooden village hamlet. Celebrate achievements with a joyful community dinner and acoustic campfire."},{"day":6,"title":"Scenic Descent & Homeward Journey","description":"Morning breakfast with mountain views. Descent to roadhead and departure transfers for onward journeys."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'solo-adventure',
  'solo-adventure',
  'solo',
  'Go Solo',
  'Solo Adventure & Wilderness Expedition',
  'Rishikesh – Tehri – Garhwal Foothills',
  '₹24,500',
  24500,
  '7 Days / 6 Nights',
  '2026-06-12',
  4.8,
  172,
  ARRAY['https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=700&fit=crop']::text[],
  '7-day multi-sport solo adventure featuring river kayaking, mountain biking, climbing & survival camps.',
  'An adrenaline-charged multi-sport expedition built for bold solo explorers. Experience white water kayaking, high mountain biking, rock climbing, and wilderness bushcraft with expert safety crews.',
  ARRAY['White water kayaking and rapid running on the Ganges', 'Mountain bike downhill trails through rugged forest terrains', 'Natural rock face climbing & 100ft waterfall rappelling', 'Wilderness survival skills workshop and primitive shelter building', 'Vibrant solo community bonding, bonfires, and barbecue nights']::text[],
  '[{"day":1,"title":"Rendezvous at Adventure Hub & Orientation","description":"Assemble at Rishikesh riverside base. Equipment check, icebreaker games with fellow solo adventurers, and welcome barbecue."},{"day":2,"title":"White River Kayaking & Canyon Gorge Navigation","description":"Master paddle strokes and river reading on Grade II-III rapids. Navigate through deep limestone river canyons."},{"day":3,"title":"High-Altitude Biking across Rugged Forest Valleys","description":"Mountain biking trail winding through dense oak forests, pine valleys, and mountain viewpoints overlooking Tehri lake."},{"day":4,"title":"Wilderness Survival Workshop & Solo Forest Stargazing","description":"Learn bushcraft skills: fire making, water filtration, shelter construction, and spend an evening stargazing in silence."},{"day":5,"title":"Rock Climbing & Waterfall Rappelling Expedition","description":"Conquer natural granite cliff faces with certified climbing instructors, followed by thrilling waterfall rappelling."},{"day":6,"title":"Cliff-Side Sunset Trek & Farewell Bonfire","description":"Trek to panoramic sunset viewpoint over the Himalayan foothills. Gala farewell celebration with music and campfire feast."},{"day":7,"title":"Morning Trail Walk & Departure Transfer","description":"Dawn nature walk, hearty breakfast, farewell group photos, and transfer to transport station."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

INSERT INTO public.tours (
  id, slug, category, category_name, title, location, price, price_number, duration, dates, rating, reviews_count, images, short_description, full_description, highlights, itinerary, transportation, accommodation, status
)
VALUES (
  'solo-customized',
  'solo-customized',
  'solo',
  'Go Solo',
  'Solo Customized Discovery Journey',
  'Customized Solo Destination (India & Abroad)',
  '₹28,000',
  28000,
  '5 Days / 4 Nights',
  '2026-04-20',
  4.9,
  198,
  ARRAY['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1000&h=700&fit=crop', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&h=700&fit=crop']::text[],
  '5-day tailored solo exploration trip with curated stays, private transfers & flexible daily plans.',
  'Your journey, your rules. A bespoke solo travel experience crafted around your passions — whether cafe hopping in quaint mountain villages, photography walks in ancient cities, or tranquil wellness retreats.',
  ARRAY['100% personalized itinerary tailored for independent solo wanderers', 'Handpicked boutique solo-friendly stays and stylish hostels', 'Curated insider recommendations for hidden cafes, viewpoints & food', 'Flexible schedule with complete freedom of exploration', '24/7 digital concierge on WhatsApp for safety & assistance']::text[],
  '[{"day":1,"title":"Arrival, Boutique Check-in & Self-Guided City Stroll","description":"Smooth private transfer to boutique solo accommodation. Unpack, settle in, and explore nearby cafes and streets at your own leisure."},{"day":2,"title":"Curated Solo Cultural Walking Tour & Artisan Workshops","description":"Follow your personalized interactive trail through hidden heritage alleys, art galleries, and local artisan studios."},{"day":3,"title":"Offbeat Countryside Adventure & Local Immersion","description":"Day trip to tranquil countryside or mountain hamlets. Experience genuine local cuisine, scenic walks, and photography spots."},{"day":4,"title":"Free-Spirited Explorer Day at Leisure & Sunset Viewpoint","description":"A day entirely your own: relax at a scenic cafe, read, journal, or visit offbeat landmarks. Catch golden hour at top sunset spot."},{"day":5,"title":"Cafe Breakfast, Local Souvenir Market & Airport Transfer","description":"Enjoy your favorite morning brew and breakfast, pick up handmade local souvenirs, and smooth private transfer for departure."}]',
  'Included',
  'Included',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  price_number = EXCLUDED.price_number,
  duration = EXCLUDED.duration,
  dates = EXCLUDED.dates,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  highlights = EXCLUDED.highlights,
  itinerary = EXCLUDED.itinerary,
  transportation = EXCLUDED.transportation,
  accommodation = EXCLUDED.accommodation,
  status = EXCLUDED.status;

-- ------------------------------------------------------------------------------
-- 3. SEED BLOG POSTS
-- ------------------------------------------------------------------------------

INSERT INTO public.blog_posts (
  id, slug, title, category, rating, featured_image, short_description, author, content, tags, status, views
)
VALUES (
  '1',
  'top-10-himalayan-treks-beginners',
  'Top 10 Himalayan Treks for Beginners',
  'Trekking',
  5,
  'https://res.cloudinary.com/izgswkwq/image/upload/v1790318351/alpine_explorers/yvd4rcam8rzacbudmpm7.jpg',
  'Start your trekking journey with these beginner-friendly Himalayan trails.',
  'Alpine Explorers',
  'Kedarkantha, Brahmatal and Chopta offer the perfect first taste of Himalayan trekking. Trained guides, comfortable camps and curated inclusions make the journey safe and memorable.\n\nEvery winter our trekkers summit peaks between 12,000 and 14,000 feet with proper acclimatization plans and certified instructors.',
  ARRAY['Trekking', 'Himalayas', 'Beginner']::text[],
  'published',
  240
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  featured_image = EXCLUDED.featured_image,
  short_description = EXCLUDED.short_description,
  author = EXCLUDED.author,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  views = EXCLUDED.views;

INSERT INTO public.blog_posts (
  id, slug, title, category, rating, featured_image, short_description, author, content, tags, status, views
)
VALUES (
  '2',
  'best-time-visit-maldives',
  'The Best Time to Visit the Maldives',
  'Beaches',
  5,
  'https://res.cloudinary.com/izgswkwq/image/upload/v1790318353/alpine_explorers/eepbrp9zclsfbh9ofltd.jpg',
  'Plan the perfect island escape with our seasonal guide to the Maldives.',
  'Alpine Explorers',
  'The Maldives shines from November to April with clear skies and calm seas. Overwater villas, coral reefs and dolphin cruises make it an unmatched tropical retreat packaged by Alpine Explorers.',
  ARRAY['Maldives', 'Beaches', 'Islands']::text[],
  'published',
  240
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  featured_image = EXCLUDED.featured_image,
  short_description = EXCLUDED.short_description,
  author = EXCLUDED.author,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  views = EXCLUDED.views;

INSERT INTO public.blog_posts (
  id, slug, title, category, rating, featured_image, short_description, author, content, tags, status, views
)
VALUES (
  '3',
  'family-camping-sasan-gir',
  'Family Camping at Sasan Gir',
  'Camping',
  5,
  'https://res.cloudinary.com/izgswkwq/image/upload/v1790318354/alpine_explorers/xus1jrug4sp0atslobhy.jpg',
  'Wildlife awareness, campfires and lion territory — the perfect family weekend.',
  'Alpine Explorers',
  'Our Gir family camp blends wildlife awareness, museum visits, a lion-spotting jeep safari and cozy campfire evenings. One tent per family, sleeping bags provided, and certified nature guides throughout.',
  ARRAY['Camping', 'Wildlife', 'Family']::text[],
  'published',
  240
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  featured_image = EXCLUDED.featured_image,
  short_description = EXCLUDED.short_description,
  author = EXCLUDED.author,
  content = EXCLUDED.content,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  views = EXCLUDED.views;
