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
    U('photo-1512100356356-de1b84283e18'), // Bali – temples
    U('photo-1537996194471-e657df975ab4'), // Bali – rice terraces
    U('photo-1514282401047-d79a71a590e8'), // Tropical resort
    U('photo-1582967788606-a171c1080cb0'), // Marine / snorkelling
  ],
  'int-3': [
    U('photo-1518684079-3c830dcef090'), // Dubai skyline
    U('photo-1521133573892-e44906baee46'), // Desert dunes
    U('photo-1469854523086-cc02fe5d8800'), // Desert highway drive
    U('photo-1580674684081-7617fbf3d745'), // Dubai Marina
  ],
  'int-4': [
    U('photo-1525625293386-3f8f99389edd'), // Singapore skyline
    U('photo-1507525428034-b723cf961d3e'), // Tropical island coast
    U('photo-1514282401047-d79a71a590e8'), // Island resort
    U('photo-1506973035872-a4ec16b8e8d9'), // Gardens by the Bay
  ],
  'int-5': [
    U('photo-1506665531195-3566af2b4dfa'), // Thailand – longtail boat
    U('photo-1528181304800-259b08848526'), // Thailand – islands
    U('photo-1507525428034-b723cf961d3e'), // Phuket-style beach
    U('photo-1514282401047-d79a71a590e8'), // Island resort
  ],

  // Specific International Named Slugs
  'int-dubai': [
    U('photo-1518684079-3c830dcef090'), // Dubai Burj Khalifa
    U('photo-1521133573892-e44906baee46'), // Desert Safari dunes
    U('photo-1469854523086-cc02fe5d8800'), // Desert highway
    U('photo-1580674684081-7617fbf3d745'), // Dubai Marina skyline
  ],
  'int-thailand': [
    U('photo-1506665531195-3566af2b4dfa'),
    U('photo-1528181304800-259b08848526'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1505118380757-91f5f5632de0'),
  ],
  'int-bali': [
    U('photo-1512100356356-de1b84283e18'),
    U('photo-1537996194471-e657df975ab4'),
    U('photo-1514282401047-d79a71a590e8'),
    U('photo-1582967788606-a171c1080cb0'),
  ],
  'int-europe': [
    U('photo-1502602898657-3e91760cbb34'),
    U('photo-1499856871958-5b9627545d1a'),
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1516483638261-f4dbaf036963'),
  ],
  'int-phuket-krabi': [
    U('photo-1528181304800-259b08848526'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1506665531195-3566af2b4dfa'),
    U('photo-1544551763-46a013bb70d5'),
  ],
  'int-sri-lanka': [
    U('photo-1586861635167-e5223aadc9fe'),
    U('photo-1546708973-b339540b5162'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1476514525535-07fb3b4ae5f1'),
  ],
  'int-lakshadweep': [
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1544551763-46a013bb70d5'),
    U('photo-1514282401047-d79a71a590e8'),
    U('photo-1582967788606-a171c1080cb0'),
  ],
  'int-singapore-malaysia': [
    U('photo-1525625293386-3f8f99389edd'),
    U('photo-1506973035872-a4ec16b8e8d9'),
    U('photo-1528181304800-259b08848526'),
    U('photo-1514282401047-d79a71a590e8'),
  ],
  'int-maldives': [
    U('photo-1514282401047-d79a71a590e8'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1582967788606-a171c1080cb0'),
    U('photo-1544551763-46a013bb70d5'),
  ],
  'int-vietnam': [
    U('photo-1528127269322-539801943592'),
    U('photo-1509042239860-f550ce710b93'),
    U('photo-1555939594-58d7cb561ad1'),
    U('photo-1506665531195-3566af2b4dfa'),
  ],
  'int-baku': [
    U('photo-1584646098378-0874589d76b1'),
    U('photo-1568605117036-5fe5e7bab0b7'),
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1469854523086-cc02fe5d8800'),
  ],
  'int-bhutan': [
    U('photo-1578632767115-351597cf2477'),
    U('photo-1544735716-392fe2489ffa'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1506905925346-21bda4d32df4'),
  ],

  // Domestic
  'dom-1': [
    U('photo-1476514525535-07fb3b4ae5f1'), // Kashmir – lakes
    U('photo-1610041321327-b794c052db27'), // Kashmir – mountains
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan snow peaks
    U('photo-1470071459604-3b5ec3a7fe05'), // Misty valley
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
    U('photo-1476514525535-07fb3b4ae5f1'), // Himachal lakeside
    U('photo-1483728642387-6c3bdd6c93e5'), // Snowy hill station
    U('photo-1464822759023-fed622ff2c3b'), // Himalayan peaks
    U('photo-1470071459604-3b5ec3a7fe05'), // Misty valleys
  ],

  // Specific Domestic Named Slugs
  'dom-kashmir-himachal': [
    U('photo-1476514525535-07fb3b4ae5f1'),
    U('photo-1610041321327-b794c052db27'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1483728642387-6c3bdd6c93e5'),
  ],
  'dom-goa': [
    U('photo-1512343879784-a960bf40e7f2'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1544551763-46a013bb70d5'),
    U('photo-1514282401047-d79a71a590e8'),
  ],
  'dom-andaman': [
    U('photo-1544551763-46a013bb70d5'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1514282401047-d79a71a590e8'),
    U('photo-1582967788606-a171c1080cb0'),
  ],
  'dom-kerala': [
    U('photo-1602216056096-3b40cc0c9944'),
    U('photo-1476514525535-07fb3b4ae5f1'),
    U('photo-1441974231531-c6227db76b6e'),
    U('photo-1500530855697-b586d89ba3ee'),
  ],
  'dom-seven-sisters': [
    U('photo-1441974231531-c6227db76b6e'),
    U('photo-1465056836041-7f43ac27dcb5'),
    U('photo-1470071459604-3b5ec3a7fe05'),
    U('photo-1476514525535-07fb3b4ae5f1'),
  ],
  'dom-rajasthan': [
    U('photo-1477587458883-47145ed94245'),
    U('photo-1524492412937-b28074a5d7da'),
    U('photo-1451337516015-6b6e9a44a8a3'),
    U('photo-1521133573892-e44906baee46'),
  ],
  'dom-sikkim': [
    U('photo-1465056836041-7f43ac27dcb5'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1470071459604-3b5ec3a7fe05'),
    U('photo-1500530855697-b586d89ba3ee'),
  ],

  // Mountain
  'mtn-1': [
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1501785888041-af3ef285b470'),
    U('photo-1551632811-561732d1e306'),
  ],
  'mtn-2': [
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1544731612-de7f96afe55f'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1483728642387-6c3bdd6c93e5'),
  ],
  'mtn-3': [
    U('photo-1544735716-392fe2489ffa'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1483728642387-6c3bdd6c93e5'),
    U('photo-1454496522488-7a8e488e8606'),
  ],
  'mtn-4': [
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1470071459604-3b5ec3a7fe05'),
    U('photo-1500530855697-b586d89ba3ee'),
  ],
  'mtn-manali-leh': [
    U('photo-1544731612-de7f96afe55f'),
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1483728642387-6c3bdd6c93e5'),
  ],
  'mtn-leh-ladakh': [
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1544731612-de7f96afe55f'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1483728642387-6c3bdd6c93e5'),
  ],
  'mtn-winter-spiti': [
    U('photo-1493246507139-91e8fad9978e'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1483728642387-6c3bdd6c93e5'),
    U('photo-1454496522488-7a8e488e8606'),
  ],
  'mtn-mountaineering-expedition': [
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1551632811-561732d1e306'),
  ],
  'mtn-trekking-camping': [
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1501785888041-af3ef285b470'),
  ],

  // Adventure
  'adv-1': [
    U('photo-1501555088652-021faa106b9b'),
    U('photo-1518998053901-5348d3961a04'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1441974231531-c6227db76b6e'),
  ],
  'adv-2': [
    U('photo-1501555088652-021faa106b9b'),
    U('photo-1551632811-561732d1e306'),
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1470071459604-3b5ec3a7fe05'),
  ],
  'adv-3': [
    U('photo-1451337516015-6b6e9a44a8a3'),
    U('photo-1521133573892-e44906baee46'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1469854523086-cc02fe5d8800'),
  ],
  'adv-4': [
    U('photo-1558981806-ec527fa84c39'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1483728642387-6c3bdd6c93e5'),
  ],
  'adv-brahmatal': [
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1470071459604-3b5ec3a7fe05'),
  ],
  'adv-kedarkantha': [
    U('photo-1454496522488-7a8e488e8606'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1506905925346-21bda4d32df4'),
  ],
  'adv-chopta-rishikesh': [
    U('photo-1506097425191-7ad538b29cef'),
    U('photo-1501555088652-021faa106b9b'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1464822759023-fed622ff2c3b'),
  ],
  'adv-manali-kasol': [
    U('photo-1547347298-4074fc3086f0'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1470071459604-3b5ec3a7fe05'),
  ],
  'adv-jaisalmer': [
    U('photo-1521133573892-e44906baee46'),
    U('photo-1451337516015-6b6e9a44a8a3'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1469854523086-cc02fe5d8800'),
  ],
  'adv-saputara': [
    U('photo-1470071459604-3b5ec3a7fe05'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1441974231531-c6227db76b6e'),
    U('photo-1500530855697-b586d89ba3ee'),
  ],
  'adv-beyt-dwarka': [
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1544551763-46a013bb70d5'),
    U('photo-1582967788606-a171c1080cb0'),
    U('photo-1478131143081-80f7f84ca84d'),
  ],

  // Family
  'fam-1': [
    U('photo-1516483638261-f4dbaf036963'),
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1501785888041-af3ef285b470'),
    U('photo-1476514525535-07fb3b4ae5f1'),
  ],
  'fam-2': [
    U('photo-1544551763-46a013bb70d5'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1514282401047-d79a71a590e8'),
    U('photo-1582967788606-a171c1080cb0'),
  ],
  'fam-3': [
    U('photo-1477587458883-47145ed94245'),
    U('photo-1546182990-dffeafbe841d'),
    U('photo-1524492412937-b28074a5d7da'),
    U('photo-1451337516015-6b6e9a44a8a3'),
  ],
  'fam-4': [
    U('photo-1464822759023-fed622ff2c3b'),
    U('photo-1483728642387-6c3bdd6c93e5'),
    U('photo-1470071459604-3b5ec3a7fe05'),
    U('photo-1500530855697-b586d89ba3ee'),
  ],
  'fam-gir-nature': [
    U('photo-1546182990-dffeafbe841d'),
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1441974231531-c6227db76b6e'),
    U('photo-1470071459604-3b5ec3a7fe05'),
  ],
  'fam-gir-camping': [
    U('photo-1478131143081-80f7f84ca84d'),
    U('photo-1546182990-dffeafbe841d'),
    U('photo-1500530855697-b586d89ba3ee'),
    U('photo-1441974231531-c6227db76b6e'),
  ],
  'fam-customized': [
    U('photo-1516483638261-f4dbaf036963'),
    U('photo-1476514525535-07fb3b4ae5f1'),
    U('photo-1507525428034-b723cf961d3e'),
    U('photo-1506905925346-21bda4d32df4'),
  ],

  // Solo
  'solo-1': [
    U('photo-1502602898657-3e91760cbb34'),
    U('photo-1552733407-5d5c46c3bb3b'),
    U('photo-1499856871958-5b9627545d1a'),
    U('photo-1513635269975-59663e0ac1ad'),
  ],
  'solo-2': [
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1558981806-ec527fa84c39'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1544731612-de7f96afe55f'),
  ],
  'solo-3': [
    U('photo-1506665531195-3566af2b4dfa'),
    U('photo-1528181304800-259b08848526'),
    U('photo-1528127269322-539801943592'),
    U('photo-1507525428034-b723cf961d3e'),
  ],
  'solo-trekking': [
    U('photo-1626621341517-bbf3d9990a23'),
    U('photo-1558981806-ec527fa84c39'),
    U('photo-1469854523086-cc02fe5d8800'),
    U('photo-1544731612-de7f96afe55f'),
  ],
  'solo-adventure': [
    U('photo-1506665531195-3566af2b4dfa'),
    U('photo-1528181304800-259b08848526'),
    U('photo-1501555088652-021faa106b9b'),
    U('photo-1478131143081-80f7f84ca84d'),
  ],
  'solo-customized': [
    U('photo-1502602898657-3e91760cbb34'),
    U('photo-1552733407-5d5c46c3bb3b'),
    U('photo-1506905925346-21bda4d32df4'),
    U('photo-1469854523086-cc02fe5d8800'),
  ],

  // data.js tours (rendered via TourCard on TravelMood, keyed by numeric id)
  '1': [
    U('photo-1512100356356-de1b84283e18'), // Bali – temples
    U('photo-1537996194471-e657df975ab4'), // Bali – rice terraces
    U('photo-1514282401047-d79a71a590e8'), // Tropical resort
    U('photo-1582967788606-a171c1080cb0'), // Marine / snorkelling
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
    U('photo-1506905925346-21bda4d32df4'), // Seine view
    U('photo-1516483638261-f4dbaf036963'), // European street
  ],
}