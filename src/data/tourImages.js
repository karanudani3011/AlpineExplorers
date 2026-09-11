const U = (id) => `https://images.unsplash.com/${id}?w=1000&h=700&fit=crop`

export const tourImages = {
  // International
  'int-1': [
    U('photo-1502602898657-3e91760cbb34'), // Paris – Eiffel Tower
    U('photo-1499856871958-5b9627545d1a'), // Paris – Louvre
    U('photo-1506905925346-21bda4d32df4'), // Swiss Alps
    U('photo-1501785888041-af3ef285b470'), // Alpine lake
  ],
  'int-2': [
    U('photo-1537225228614-b2fa3a0ff0ff'), // Bali – temples
    U('photo-1537996194471-e657df975ab4'), // Bali – rice terraces
    U('photo-1514282401047-d79a71a590e8'), // Tropical resort
    U('photo-1582967788606-a171c1080cb0'), // Marine / snorkelling
    U('photo-1507525428034-b723cf961d3e'), // Paradise beach
  ],
  'int-3': [
    U('photo-1512453395758-6b78f76b7f0e'), // Dubai skyline
    U('photo-1521133573892-e44906baee46'), // Desert dunes
    U('photo-1469854523086-cc02fe5d8800'), // Desert highway drive
  ],
  'int-4': [
    U('photo-1525625293386-3f8f99389edd'), // Singapore skyline
    U('photo-1507525428034-b723cf961d3e'), // Tropical island coast
    U('photo-1514282401047-d79a71a590e8'), // Island resort
  ],
  'int-5': [
    U('photo-1506665531195-3566af2b4dfa'), // Thailand – longtail boat
    U('photo-1528181304800-259b08848526'), // Thailand – islands
    U('photo-1507525428034-b723cf961d3e'), // Phuket-style beach
    U('photo-1514282401047-d79a71a590e8'), // Island resort
  ],

  // Domestic
  'dom-1': [
    U('photo-1597074866923-dc0589150a32'), // Kashmir – lakes
    U('photo-1583249598640-3cae04577837'), // Kashmir – mountains
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan snow peaks
    U('photo-1470071459604-3b5ec3a7fe05'), // Misty valley
    U('photo-1476514525535-07fb3b4ae5f1'), // Hill-side lake
  ],
  'dom-2': [
    U('photo-1477587458883-47145ed94245'), // Jaipur – Amber Fort
    U('photo-1524492412937-b28074a5d7da'), // Taj Mahal
    U('photo-1451337516015-6b6e9a44a8a3'), // Desert camel
    U('photo-1521133573892-e44906baee46'), // Thar desert dunes
  ],
  'dom-3': [
    U('photo-1512343879784-a960bf40e7f2'), // Goa coast
    U('photo-1507525428034-b723cf961d3e'), // Beach day
    U('photo-1544551763-46a013bb70d5'), // Sunset boat ride
    U('photo-1514282401047-d79a71a590e8'), // Beach resort
  ],
  'dom-4': [
    U('photo-1602216056096-3b40cc0c9944'), // Kerala backwaters
    U('photo-1476514525535-07fb3b4ae5f1'), // Backwater canoe
    U('photo-1441974231531-c6227db76b6e'), // Forest / Munnar greenery
    U('photo-1500530855697-b586d89ba3ee'), // Highland trail
  ],
  'dom-5': [
    U('photo-1597074866923-dc0589150a32'), // Himachal lakeside
    U('photo-1483728642387-6c3bdd6c93e5'), // Snowy hill station
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan peaks
    U('photo-1470071459604-3b5ec3a7fe05'), // Misty valleys
  ],

  // Mountain
  'mtn-1': [
    U('photo-1506905925346-21bda4d32df4'), // Matterhorn
    U('photo-1454496522488-7a8e488e8606'), // Alpine ridge
    U('photo-1501785888041-af3ef285b470'), // Alpine lake
    U('photo-1551632811-561732d1e306'), // High-altitude hiking
  ],
  'mtn-2': [
    U('photo-1626621341517-bbf3d9990a23'), // Ladakh river
    U('photo-1544731612-de7f96afe55f'), // Ladakh mountains
    U('photo-1469854523086-cc02fe5d8800'), // High mountain road
    U('photo-1483728642387-6c3bdd6c93e5'), // Snowy passes
  ],
  'mtn-3': [
    U('photo-1544735716-392fe2489ffa'), // Everest region
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan snowcaps
    U('photo-1483728642387-6c3bdd6c93e5'), // High-altitude peaks
    U('photo-1454496522488-7a8e488e8606'), // Summit ridge
  ],
  'mtn-4': [
    U('photo-1464822759023-fed622ff2c3b'), // Snowy peaks
    U('photo-1454496522488-7a8e488e8606'), // Summit views
    U('photo-1470071459604-3b5ec3a7fe05'), // Misty ridges
    U('photo-1500530855697-b586d89ba3ee'), // Alpine meadows
  ],

  // Adventure
  'adv-1': [
    U('photo-1501555088652-021faa106b9b'), // White water rafting
    U('photo-1518998053901-5348d3961a04'), // Riverside campfire
    U('photo-1478131143081-80f7f84ca84d'), // Forest camp tent
    U('photo-1441974231531-c6227db76b6e'), // Forest / Ganges greenery
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan backdrop
  ],
  'adv-2': [
    U('photo-1530866495561-507c83749968'), // Bungee jump
    U('photo-1551632811-561732d1e306'), // Thrill activities
    U('photo-1454496522488-7a8e488e8606'), // Valley ridge views
    U('photo-1470071459604-3b5ec3a7fe05'), // Valley mist
  ],
  'adv-3': [
    U('photo-1451337516015-6b6e9a44a8a3'), // Desert camel safari
    U('photo-1521133573892-e44906baee46'), // Sand dunes
    U('photo-1478131143081-80f7f84ca84d'), // Desert camping tent
    U('photo-1469854523086-cc02fe5d8800'), // Desert highway
  ],
  'adv-4': [
    U('photo-1558981806-ec527fa84c39'), // Motorcycle expedition
    U('photo-1469854523086-cc02fe5d8800'), // Open mountain highway
    U('photo-1626621341517-bbf3d9990a23'), // Ladakh river road
    U('photo-1483728642387-6c3bdd6c93e5'), // High mountain passes
  ],

  // Family
  'fam-1': [
    U('photo-1516483638261-f4dbaf036963'), // Neuschwanstein castle
    U('photo-1506905925346-21bda4d32df4'), // Alpine scenery
    U('photo-1501785888041-af3ef285b470'), // Alpine lake
    U('photo-1476514525535-07fb3b4ae5f1'), // Family lake outing
  ],
  'fam-2': [
    U('photo-1544551763-46a013bb70d5'), // Andaman boat cruise
    U('photo-1507525428034-b723cf961d3e'), // Radhanagar-style beach
    U('photo-1514282401047-d79a71a590e8'), // Island resort
    U('photo-1582967788606-a171c1080cb0'), // Marine / snorkelling
  ],
  'fam-3': [
    U('photo-1477587458883-47145ed94245'), // Amber Fort
    U('photo-1546182990-dffeafbe841d'), // Ranthambore wildlife
    U('photo-1524492412937-b28074a5d7da'), // Taj Mahal
    U('photo-1451337516015-6b6e9a44a8a3'), // Desert camel ride
  ],
  'fam-4': [
    U('photo-1464822759023-fed622ff2c3b'), // Snowy Manali peaks
    U('photo-1483728642387-6c3bdd6c93e5'), // Snowbound hills
    U('photo-1470071459604-3b5ec3a7fe05'), // Shimla misty hills
    U('photo-1500530855697-b586d89ba3ee'), // Family valley trails
  ],

  // Solo
  'solo-1': [
    U('photo-1502602898657-3e91760cbb34'), // Paris – Eiffel Tower
    U('photo-1552733407-5d5c46c3bb3b'), // Solo traveller
    U('photo-1499856871958-5b9627545d1a'), // Paris – Louvre
    U('photo-1513635269975-59663e0ac1ad'), // European city
  ],
  'solo-2': [
    U('photo-1626621341517-bbf3d9990a23'), // Ladakh ride
    U('photo-1558981806-ec527fa84c39'), // Motorcycle journey
    U('photo-1469854523086-cc02fe5d8800'), // Open highway
    U('photo-1544731612-de7f96afe55f'), // Ladakh landscape
  ],
  'solo-3': [
    U('photo-1506665531195-3566af2b4dfa'), // Thailand – longtail boat
    U('photo-1528181304800-259b08848526'), // Southeast Asia islands
    U('photo-1528127269322-539801943592'), // Vietnam – Hanoi
    U('photo-1507525428034-b723cf961d3e'), // Tropical beaches
  ],

  // data.js tours (rendered via TourCard on TravelMood, keyed by numeric id)
  '1': [
    U('photo-1537225228614-b2fa3a0ff0ff'), // Bali – temples
    U('photo-1537996194471-e657df975ab4'), // Bali – rice terraces
    U('photo-1514282401047-d79a71a590e8'), // Tropical resort
    U('photo-1582967788606-a171c1080cb0'), // Marine / snorkelling
    U('photo-1507525428034-b723cf961d3e'), // Paradise beach
  ],
  '2': [
    U('photo-1506905925346-21bda4d32df4'), // Matterhorn
    U('photo-1454496522488-7a8e488e8606'), // Alpine ridge
    U('photo-1501785888041-af3ef285b470'), // Alpine lake
    U('photo-1551632811-561732d1e306'), // High-altitude hiking
  ],
  '3': [
    U('photo-1501555088652-021faa106b9b'), // White water rafting
    U('photo-1441974231531-c6227db76b6e'), // River canyon forest
    U('photo-1478131143081-80f7f84ca84d'), // Riverside camp tent
    U('photo-1518998053901-5348d3961a04'), // Campfire
  ],
  '4': [
    U('photo-1516483638261-f4dbaf036963'), // Neuschwanstein castle
    U('photo-1506905925346-21bda4d32df4'), // Alpine scenery
    U('photo-1501785888041-af3ef285b470'), // Alpine lake
    U('photo-1476514525535-07fb3b4ae5f1'), // Family lake outing
  ],
  '5': [
    U('photo-1469854523086-cc02fe5d8800'), // Wilderness highway
    U('photo-1441974231531-c6227db76b6e'), // National park forest
    U('photo-1546182990-dffeafbe841d'), // Wildlife safari
    U('photo-1470071459604-3b5ec3a7fe05'), // Teton-style peaks
  ],
  '6': [
    U('photo-1502602898657-3e91760cbb34'), // Paris – Eiffel Tower
    U('photo-1499856871958-5b9627545d1a'), // Paris – Louvre
  ],
}