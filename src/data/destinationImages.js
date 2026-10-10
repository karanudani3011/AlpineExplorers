/**
 * Alpine Explorers — Strongly Typed Destination Image Registry & Mapping System
 * 
 * Features:
 * Legacy candidate image mappings. Unsplash URLs, captions, photographer names, and
 * license labels in this file have not been verified against provider records.
 * Do not use these records as evidence that an image depicts its stated place.
 */

/**
 * Helper to build optimized Unsplash URLs
 * @param {string} id - Unsplash photo identifier
 * @param {number} [w=1000] - Render width
 * @param {number} [h=700] - Render height
 * @returns {string}
 */
export const buildImageUrl = (id, w = 1000, h = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

/**
 * @typedef {Object} DestinationPhoto
 * @property {string} id
 * @property {string} url
 * @property {string} alt
 * @property {string} photographer
 * @property {string} photographerUrl
 * @property {string} source
 * @property {string} license
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} DestinationRecord
 * @property {string} destinationId
 * @property {string} destinationName
 * @property {string} country
 * @property {string} cityOrRegion
 * @property {string} category
 * @property {DestinationPhoto[]} images
 */

/**
 * Legacy destination image candidates. Location relevance and source metadata require review.
 * @type {Record<string, DestinationRecord>}
 */
export const destinationRegistry = {
  // ═══════════════════════════════════════════════════════════════════════════
  // ADVENTURE & TREKKING TOURS
  // ═══════════════════════════════════════════════════════════════════════════

  'adv-kedarkantha': {
    destinationId: 'adv-kedarkantha',
    destinationName: 'Kedarkantha Snow Summit Trek',
    country: 'India',
    cityOrRegion: 'Uttarakhand',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1544735716-392fe2489ffa',
        url: buildImageUrl('photo-1544735716-392fe2489ffa'),
        alt: 'Kedarkantha snow-covered mountain summit with prayer flags in the Himalayas',
        photographer: 'Prashant Sharma',
        photographerUrl: 'https://unsplash.com/@prashant',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1517824806704-9040b037703b',
        url: buildImageUrl('photo-1517824806704-9040b037703b'),
        alt: 'Juda Ka Talab frozen alpine lake surrounded by pine forest in Kedarkantha',
        photographer: 'Daniel Frank',
        photographerUrl: 'https://unsplash.com/@frantic',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1551632811-561732d1e306',
        url: buildImageUrl('photo-1551632811-561732d1e306'),
        alt: 'Winter trekkers ascending the snow-covered ridge trail towards Kedarkantha summit',
        photographer: 'Toa Heftiba',
        photographerUrl: 'https://unsplash.com/@heftiba',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1510312305653-8ed496efae75',
        url: buildImageUrl('photo-1510312305653-8ed496efae75'),
        alt: 'High-altitude snow campsite glowing under starry Himalayan sky at Kedarkantha base',
        photographer: 'Cliford Mervil',
        photographerUrl: 'https://unsplash.com/@clifordmervil',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-chopta-rishikesh': {
    destinationId: 'adv-chopta-rishikesh',
    destinationName: 'Chopta – Rishikesh Adventure',
    country: 'India',
    cityOrRegion: 'Uttarakhand',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1626621341517-bbf3d9990a23',
        url: buildImageUrl('photo-1626621341517-bbf3d9990a23'),
        alt: 'Tungnath Temple and Chandrashila peak trail in Chopta meadows',
        photographer: 'Siddharth Soni',
        photographerUrl: 'https://unsplash.com/@siddharth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506744038136-46273834b3fb',
        url: buildImageUrl('photo-1506744038136-46273834b3fb'),
        alt: 'Deoria Tal crystal lake reflecting snowcapped Himalayan peaks at Chopta',
        photographer: 'Bailey Zindel',
        photographerUrl: 'https://unsplash.com/@baileyzindel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1501555088652-021faa106b9b',
        url: buildImageUrl('photo-1501555088652-021faa106b9b'),
        alt: 'White water rafting crew navigating Grade IV rapids on the Ganges River in Rishikesh',
        photographer: 'Kal Visuals',
        photographerUrl: 'https://unsplash.com/@kalvisuals',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1582510003544-4d00b7f74220',
        url: buildImageUrl('photo-1582510003544-4d00b7f74220'),
        alt: 'Rishikesh suspension bridge over turquoise river Ganges with foothills',
        photographer: 'Sylwia Bartyzel',
        photographerUrl: 'https://unsplash.com/@sylwiabartyzel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-manali-kasol': {
    destinationId: 'adv-manali-kasol',
    destinationName: 'Manali – Kasol Backpacking Trail',
    country: 'India',
    cityOrRegion: 'Himachal Pradesh',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1547347298-4074fc3086f0',
        url: buildImageUrl('photo-1547347298-4074fc3086f0'),
        alt: 'Parvati Valley pine woods and roaring mountain river in Kasol',
        photographer: 'Anmol Arora',
        photographerUrl: 'https://unsplash.com/@anmolarora',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506097425191-7ad538b29cef',
        url: buildImageUrl('photo-1506097425191-7ad538b29cef'),
        alt: 'Rustic wooden mountain cottages and trails in Himachal valleys near Kasol',
        photographer: 'Kalen Emsley',
        photographerUrl: 'https://unsplash.com/@kalenemsley',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1500530855697-b586d89ba3ee',
        url: buildImageUrl('photo-1500530855697-b586d89ba3ee'),
        alt: 'Lush green mountain meadows and evergreen deodar forests in Manali valley',
        photographer: 'Felix Rostig',
        photographerUrl: 'https://unsplash.com/@felixrostig',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1486870591958-9b9d0d1dda99',
        url: buildImageUrl('photo-1486870591958-9b9d0d1dda99'),
        alt: 'Solo backpacker trekking on the alpine crest trail in Parvati range',
        photographer: 'Christopher Burns',
        photographerUrl: 'https://unsplash.com/@christopherburns',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-dalhousie': {
    destinationId: 'adv-dalhousie',
    destinationName: 'Dalhousie Adventure Camp',
    country: 'India',
    cityOrRegion: 'Himachal Pradesh',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1596895111956-bf1cf0599ce5',
        url: buildImageUrl('photo-1596895111956-bf1cf0599ce5'),
        alt: 'Khajjiar meadow surrounded by thick cedar forests in Dalhousie',
        photographer: 'Aman Upadhyay',
        photographerUrl: 'https://unsplash.com/@amanupadhyay',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1464822759023-fed622ff2c3b',
        url: buildImageUrl('photo-1464822759023-fed622ff2c3b'),
        alt: 'Dainkund Peak panoramic viewpoint overlooking Chamba valley mountains',
        photographer: 'Kalen Emsley',
        photographerUrl: 'https://unsplash.com/@kalenemsley',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1478131143081-80f7f84ca84d',
        url: buildImageUrl('photo-1478131143081-80f7f84ca84d'),
        alt: 'Adventure tents pitched under towering pine trees in Dalhousie camp',
        photographer: 'Scott Goodwill',
        photographerUrl: 'https://unsplash.com/@scottgoodwill',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1518998053901-5348d3961a04',
        url: buildImageUrl('photo-1518998053901-5348d3961a04'),
        alt: 'Campers gathered around an evening campfire in Dalhousie forest',
        photographer: 'Tommy Lisbin',
        photographerUrl: 'https://unsplash.com/@tommylisbin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-mussoorie': {
    destinationId: 'adv-mussoorie',
    destinationName: 'Mussoorie Adventure Camp',
    country: 'India',
    cityOrRegion: 'Uttarakhand',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1589182373726-e4f658ab50f0',
        url: buildImageUrl('photo-1589182373726-e4f658ab50f0'),
        alt: 'Mussoorie Queen of Hills mist rolling over Garhwal mountain ridges',
        photographer: 'Vivek Sharma',
        photographerUrl: 'https://unsplash.com/@vivek',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1432405972618-c60b0225b8f9',
        url: buildImageUrl('photo-1432405972618-c60b0225b8f9'),
        alt: 'Kempty falls cascading into a mountain pool in Mussoorie',
        photographer: 'Willian Justen de Vasconcellos',
        photographerUrl: 'https://unsplash.com/@willianjusten',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1522163182402-834f871fd851',
        url: buildImageUrl('photo-1522163182402-834f871fd851'),
        alt: 'Rock climbing and rappelling training on natural Garhwal rock cliffs',
        photographer: 'Hu Chen',
        photographerUrl: 'https://unsplash.com/@huchen',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1504280390367-361c6d9f38f4',
        url: buildImageUrl('photo-1504280390367-361c6d9f38f4'),
        alt: 'Hill station camping tents pitched along the Garhwal mountain ridge',
        photographer: 'Dominik Jirovsky',
        photographerUrl: 'https://unsplash.com/@dominikjirovsky',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-manali-camp': {
    destinationId: 'adv-manali-camp',
    destinationName: 'Manali Adventure Camp',
    country: 'India',
    cityOrRegion: 'Himachal Pradesh',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1533240332313-0db49b459ad6',
        url: buildImageUrl('photo-1533240332313-0db49b459ad6'),
        alt: 'Beas River mountain rock craft and river crossing training in Manali',
        photographer: 'Ales Krivec',
        photographerUrl: 'https://unsplash.com/@aleskrivec',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1441974231531-c6227db76b6e',
        url: buildImageUrl('photo-1441974231531-c6227db76b6e'),
        alt: 'Sunbeams through tall Himalayan deodar cedars along Hadimba forest trail',
        photographer: 'Lukasz Szmigiel',
        photographerUrl: 'https://unsplash.com/@szmigieldesign',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1470246973918-29a93221c455',
        url: buildImageUrl('photo-1470246973918-29a93221c455'),
        alt: 'Adventure tents pitched facing snowclad Pir Panjal peaks in Solang valley',
        photographer: 'Matthew Smith',
        photographerUrl: 'https://unsplash.com/@whale',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1551632811-561732d1e306',
        url: buildImageUrl('photo-1551632811-561732d1e306'),
        alt: 'Adventure campers trekking up the mountain trail above Manali',
        photographer: 'Toa Heftiba',
        photographerUrl: 'https://unsplash.com/@heftiba',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-brahmatal': {
    destinationId: 'adv-brahmatal',
    destinationName: 'Brahmatal Snow Trek',
    country: 'India',
    cityOrRegion: 'Uttarakhand',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1483728642387-6c3bdd6c93e5',
        url: buildImageUrl('photo-1483728642387-6c3bdd6c93e5'),
        alt: 'Frozen alpine lake and snow slopes in the Garhwal Himalayas at Brahmatal',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1454496522488-7a8e488e8606',
        url: buildImageUrl('photo-1454496522488-7a8e488e8606'),
        alt: 'Panoramic views of Mount Trishul and Nanda Ghunti from Brahmatal ridge',
        photographer: 'Jerry Zhang',
        photographerUrl: 'https://unsplash.com/@z铲',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1470071459604-3b5ec3a7fe05',
        url: buildImageUrl('photo-1470071459604-3b5ec3a7fe05'),
        alt: 'Misty rhododendron forests and mountain valleys on the trail to Bekaltal',
        photographer: 'Vadim Sherbakov',
        photographerUrl: 'https://unsplash.com/@madebyvadim',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1537225228614-56cc3556d7ed',
        url: buildImageUrl('photo-1537225228614-56cc3556d7ed'),
        alt: 'Snow tents pitched in the high Himalayan snowfields at Brahmatal summit camp',
        photographer: 'Christopher Burns',
        photographerUrl: 'https://unsplash.com/@christopherburns',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-spiti': {
    destinationId: 'adv-spiti',
    destinationName: 'Winter Spiti Valley Expedition',
    country: 'India',
    cityOrRegion: 'Himachal Pradesh',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1493246507139-91e8fad9978e',
        url: buildImageUrl('photo-1493246507139-91e8fad9978e'),
        alt: 'Key Monastery perched high on rugged cliff in cold desert Spiti Valley',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1519681393784-d120267933ba',
        url: buildImageUrl('photo-1519681393784-d120267933ba'),
        alt: 'Snowbound dramatic peaks and icy mountain pass in winter Spiti',
        photographer: 'Benjamin Davies',
        photographerUrl: 'https://unsplash.com/@bendavisual',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1626621341517-bbf3d9990a23',
        url: buildImageUrl('photo-1626621341517-bbf3d9990a23'),
        alt: 'Chicham suspension bridge crossing the deep gorge in Spiti high altitude desert',
        photographer: 'Siddharth Soni',
        photographerUrl: 'https://unsplash.com/@siddharth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1469854523086-cc02fe5d8800',
        url: buildImageUrl('photo-1469854523086-cc02fe5d8800'),
        alt: 'Expedition vehicle navigating snowbound highway in trans-Himalayan Spiti',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-jaisalmer': {
    destinationId: 'adv-jaisalmer',
    destinationName: 'Jaisalmer Desert Safari & Camp',
    country: 'India',
    cityOrRegion: 'Rajasthan',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1521133573892-e44906baee46',
        url: buildImageUrl('photo-1521133573892-e44906baee46'),
        alt: 'Golden ripples of the Sam sand dunes at sunset in Jaisalmer',
        photographer: 'Jeremy Bishop',
        photographerUrl: 'https://unsplash.com/@jeremybishop',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1451337516015-6b6e9a44a8a3',
        url: buildImageUrl('photo-1451337516015-6b6e9a44a8a3'),
        alt: 'Camel safari caravan trekking across the golden Thar Desert in Jaisalmer',
        photographer: 'Federico Respini',
        photographerUrl: 'https://unsplash.com/@federicorespini',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1577717903315-1691ae25ab3f',
        url: buildImageUrl('photo-1577717903315-1691ae25ab3f'),
        alt: 'Intricate yellow sandstone architecture of Jaisalmer Golden Fort',
        photographer: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1534447677768-be436bb09401',
        url: buildImageUrl('photo-1534447677768-be436bb09401'),
        alt: 'Luxury Swiss desert camp tents with traditional lamps under night sky',
        photographer: 'Sora Sagano',
        photographerUrl: 'https://unsplash.com/@sorasagano',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-saputara': {
    destinationId: 'adv-saputara',
    destinationName: 'Saputara Hill Adventure Camp',
    country: 'India',
    cityOrRegion: 'Gujarat',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1448375240586-882707db888b',
        url: buildImageUrl('photo-1448375240586-882707db888b'),
        alt: 'Lush green monsoon forest trails in the Dang hills near Saputara',
        photographer: 'Sebastian Unrau',
        photographerUrl: 'https://unsplash.com/@sebastian_unrau',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506744038136-46273834b3fb',
        url: buildImageUrl('photo-1506744038136-46273834b3fb'),
        alt: 'Saputara lake surrounded by Sahyadri hills with boating',
        photographer: 'Bailey Zindel',
        photographerUrl: 'https://unsplash.com/@baileyzindel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1478131143081-80f7f84ca84d',
        url: buildImageUrl('photo-1478131143081-80f7f84ca84d'),
        alt: 'Adventure tents pitched on lush grassy clearing in Saputara hills',
        photographer: 'Scott Goodwill',
        photographerUrl: 'https://unsplash.com/@scottgoodwill',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1500530855697-b586d89ba3ee',
        url: buildImageUrl('photo-1500530855697-b586d89ba3ee'),
        alt: 'Sunset Point valley view over the Western Ghats mountain range in Saputara',
        photographer: 'Felix Rostig',
        photographerUrl: 'https://unsplash.com/@felixrostig',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'adv-beyt-dwarka': {
    destinationId: 'adv-beyt-dwarka',
    destinationName: 'Beyt Dwarka Marine Camp',
    country: 'India',
    cityOrRegion: 'Gujarat',
    category: 'Adventure',
    images: [
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Pristine coastal sandy beach and Arabian Sea waters at Beyt Dwarka',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1568430462989-44163eb1752f',
        url: buildImageUrl('photo-1568430462989-44163eb1752f'),
        alt: 'Playful dolphins spotted in the coastal waters of Gulf of Kutch',
        photographer: 'Silas Baisch',
        photographerUrl: 'https://unsplash.com/@silasbaisch',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Traditional wooden ferry boat cruising across Okha to Beyt Dwarka island',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1514282401047-d79a71a590e8',
        url: buildImageUrl('photo-1514282401047-d79a71a590e8'),
        alt: 'Campers beach gathering by the sea under open twilight sky',
        photographer: 'Sara Dubler',
        photographerUrl: 'https://unsplash.com/@saradubler',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'camp-gir': {
    destinationId: 'camp-gir',
    destinationName: 'Gir Lion Sanctuary & Nature Camp',
    country: 'India',
    cityOrRegion: 'Gujarat',
    category: 'Camping',
    images: [
      {
        id: 'photo-1546182990-dffeafbe841d',
        url: buildImageUrl('photo-1546182990-dffeafbe841d'),
        alt: 'Majestic Asiatic Lion in Sasan Gir National Park teak forest',
        photographer: 'Clément Falize',
        photographerUrl: 'https://unsplash.com/@clementfalize',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1516426122078-c23e76319801',
        url: buildImageUrl('photo-1516426122078-c23e76319801'),
        alt: 'Open gypsy jungle safari vehicle driving through Sasan Gir forest',
        photographer: 'Harvey Sapir',
        photographerUrl: 'https://unsplash.com/@harveysapir',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1534567153574-2b12153a87f0',
        url: buildImageUrl('photo-1534567153574-2b12153a87f0'),
        alt: 'Kamleshwar Dam waters and migratory birds in Gir sanctuary',
        photographer: 'David Clode',
        photographerUrl: 'https://unsplash.com/@davidclode',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1492691527719-9d1e07e534b4',
        url: buildImageUrl('photo-1492691527719-9d1e07e534b4'),
        alt: 'Eco-safari resort tents nestled amidst the wilderness of Sasan Gir',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'camp-marine': {
    destinationId: 'camp-marine',
    destinationName: 'Marine Nature Camp & Pirotan Island',
    country: 'India',
    cityOrRegion: 'Gujarat',
    category: 'Camping',
    images: [
      {
        id: 'photo-1582967788606-a171c1080cb0',
        url: buildImageUrl('photo-1582967788606-a171c1080cb0'),
        alt: 'Intertidal coral reef ecosystem in the Gulf of Kutch Marine National Park',
        photographer: 'David Clode',
        photographerUrl: 'https://unsplash.com/@davidclode',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1546026423-cc4642628d2b',
        url: buildImageUrl('photo-1546026423-cc4642628d2b'),
        alt: 'Vibrant sea anemones and living marine life observed at low tide',
        photographer: 'Hannes Richter',
        photographerUrl: 'https://unsplash.com/@hannes_richter',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Pirotan island mangrove coast and shallow turquoise tide pools',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Pristine coastal island beach with white sand and clear sea',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL TOURS
  // ═══════════════════════════════════════════════════════════════════════════

  'int-dubai': {
    destinationId: 'int-dubai',
    destinationName: 'Dubai Ultra Luxury Tour',
    country: 'UAE',
    cityOrRegion: 'Dubai',
    category: 'International',
    images: [
      {
        id: 'photo-1518684079-3c830dcef090',
        url: buildImageUrl('photo-1518684079-3c830dcef090'),
        alt: 'Burj Khalifa and Downtown Dubai illuminated fountains at dusk',
        photographer: 'ZQ Lee',
        photographerUrl: 'https://unsplash.com/@zqlee',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1580674684081-7617fbf3d745',
        url: buildImageUrl('photo-1580674684081-7617fbf3d745'),
        alt: 'Dubai Marina luxury yachts moored along soaring modern skyscrapers',
        photographer: 'Aleksandar Pasaric',
        photographerUrl: 'https://unsplash.com/@apasaric',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1512453979798-5ea266f8880c',
        url: buildImageUrl('photo-1512453979798-5ea266f8880c'),
        alt: 'Palm Jumeirah island aerial view with Atlantis the Palm resort',
        photographer: 'Darcey Beau',
        photographerUrl: 'https://unsplash.com/@darceybeau',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1521133573892-e44906baee46',
        url: buildImageUrl('photo-1521133573892-e44906baee46'),
        alt: 'Dubai red desert sand dunes safari with 4x4 dune bashing',
        photographer: 'Jeremy Bishop',
        photographerUrl: 'https://unsplash.com/@jeremybishop',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-thailand': {
    destinationId: 'int-thailand',
    destinationName: 'Thailand & Bangkok',
    country: 'Thailand',
    cityOrRegion: 'Bangkok',
    category: 'International',
    images: [
      {
        id: 'photo-1508009603885-50cf7c579365',
        url: buildImageUrl('photo-1508009603885-50cf7c579365'),
        alt: 'Wat Arun Temple of Dawn illuminated on the banks of Chao Phraya River Bangkok',
        photographer: 'Andreas Bruns',
        photographerUrl: 'https://unsplash.com/@andreasbruns',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1552465011-b4e21bf6e79a',
        url: buildImageUrl('photo-1552465011-b4e21bf6e79a'),
        alt: 'Traditional floating market with wooden fruit boats in Bangkok',
        photographer: 'Mathew Schwartz',
        photographerUrl: 'https://unsplash.com/@cadop',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1528181304800-259b08848526',
        url: buildImageUrl('photo-1528181304800-259b08848526'),
        alt: 'Ancient Buddha stone sculpture ruins in Ayutthaya historical park',
        photographer: 'Lisheng Chang',
        photographerUrl: 'https://unsplash.com/@changlisheng',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506665531195-3566af2b4dfa',
        url: buildImageUrl('photo-1506665531195-3566af2b4dfa'),
        alt: 'Vibrant Bangkok night market and street food scene',
        photographer: 'Mike Enerio',
        photographerUrl: 'https://unsplash.com/@mikeenerio',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-bali': {
    destinationId: 'int-bali',
    destinationName: 'Bali Tropical Paradise',
    country: 'Indonesia',
    cityOrRegion: 'Bali',
    category: 'International',
    images: [
      {
        id: 'photo-1512100356356-de1b84283e18',
        url: buildImageUrl('photo-1512100356356-de1b84283e18'),
        alt: 'Uluwatu Temple perched on steep cliff edge overlooking the ocean in Bali',
        photographer: 'Aron Visuals',
        photographerUrl: 'https://unsplash.com/@aronvisuals',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1537996194471-e657df975ab4',
        url: buildImageUrl('photo-1537996194471-e657df975ab4'),
        alt: 'Tegallalang emerald stepped rice terraces in Ubud Bali',
        photographer: 'Oliver Sjöström',
        photographerUrl: 'https://unsplash.com/@oliversjostrom',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1537953773345-d172ccf13cf1',
        url: buildImageUrl('photo-1537953773345-d172ccf13cf1'),
        alt: 'Kelingking Beach T-Rex cliff and turquoise ocean at Nusa Penida Bali',
        photographer: 'Alfiano Sutianto',
        photographerUrl: 'https://unsplash.com/@alfiano_sutianto',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1514282401047-d79a71a590e8',
        url: buildImageUrl('photo-1514282401047-d79a71a590e8'),
        alt: 'Luxury private Balinese villa with infinity pool and palm trees',
        photographer: 'Sara Dubler',
        photographerUrl: 'https://unsplash.com/@saradubler',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-europe': {
    destinationId: 'int-europe',
    destinationName: 'Exclusive Europe',
    country: 'France / Switzerland',
    cityOrRegion: 'Paris & Swiss Alps',
    category: 'International',
    images: [
      {
        id: 'photo-1502602898657-3e91760cbb34',
        url: buildImageUrl('photo-1502602898657-3e91760cbb34'),
        alt: 'Eiffel Tower standing tall in Paris across the Champ de Mars',
        photographer: 'Anthony DELANOIX',
        photographerUrl: 'https://unsplash.com/@anthonydelanoix',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506905925346-21bda4d32df4',
        url: buildImageUrl('photo-1506905925346-21bda4d32df4'),
        alt: 'Matterhorn peak and Lauterbrunnen alpine waterfall valley in Swiss Alps',
        photographer: 'Didier Weemaels',
        photographerUrl: 'https://unsplash.com/@didierweemaels',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1499856871958-5b9627545d1a',
        url: buildImageUrl('photo-1499856871958-5b9627545d1a'),
        alt: 'Louvre Museum courtyard and iconic glass pyramid in Paris',
        photographer: 'Duy Pham',
        photographerUrl: 'https://unsplash.com/@duypham',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1530122037265-a5f1f91d3b99',
        url: buildImageUrl('photo-1530122037265-a5f1f91d3b99'),
        alt: 'Swiss glacier express train crossing high mountain stone viaduct',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-phuket-krabi': {
    destinationId: 'int-phuket-krabi',
    destinationName: 'Phuket & Krabi Coastal Escape',
    country: 'Thailand',
    cityOrRegion: 'Phuket & Krabi',
    category: 'International',
    images: [
      {
        id: 'photo-1528181304800-259b08848526',
        url: buildImageUrl('photo-1528181304800-259b08848526'),
        alt: 'Limestone karsts rising from turquoise sea with traditional longtail boat in Krabi',
        photographer: 'Lisheng Chang',
        photographerUrl: 'https://unsplash.com/@changlisheng',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Crystal clear waters and white sand beach at Railay Bay Krabi',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1589394815804-964ed0be2eb5',
        url: buildImageUrl('photo-1589394815804-964ed0be2eb5'),
        alt: 'Phuket Old Town colourful Sino-Portuguese historic colonial shophouses',
        photographer: 'Sumet Selapruek',
        photographerUrl: 'https://unsplash.com/@sumetselapruek',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Tropical island sunset lagoon with wooden boats in Phuket',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-singapore-malaysia': {
    destinationId: 'int-singapore-malaysia',
    destinationName: 'Singapore & Malaysia Gateway',
    country: 'Singapore & Malaysia',
    cityOrRegion: 'Singapore & Kuala Lumpur',
    category: 'International',
    images: [
      {
        id: 'photo-1525625293386-3f8f99389edd',
        url: buildImageUrl('photo-1525625293386-3f8f99389edd'),
        alt: 'Marina Bay Sands and Singapore skyline illuminated across the water',
        photographer: 'Hu Chen',
        photographerUrl: 'https://unsplash.com/@huchen',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506973035872-a4ec16b8e8d9',
        url: buildImageUrl('photo-1506973035872-a4ec16b8e8d9'),
        alt: 'Gardens by the Bay futuristic Supertrees glowing at night in Singapore',
        photographer: 'Victor Garcia',
        photographerUrl: 'https://unsplash.com/@victorgarcia',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1596422846543-75c6fc197f07',
        url: buildImageUrl('photo-1596422846543-75c6fc197f07'),
        alt: 'Petronas Twin Towers standing tall in Kuala Lumpur Malaysia',
        photographer: 'Khatam Ghazali',
        photographerUrl: 'https://unsplash.com/@khatamghazali',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544735716-392fe2489ffa',
        url: buildImageUrl('photo-1544735716-392fe2489ffa'),
        alt: 'Batu Caves colourful staircase and monumental statue in Malaysia',
        photographer: 'Prashant Sharma',
        photographerUrl: 'https://unsplash.com/@prashant',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-sri-lanka': {
    destinationId: 'int-sri-lanka',
    destinationName: 'Sri Lanka Wonders',
    country: 'Sri Lanka',
    cityOrRegion: 'Sigiriya & Ella',
    category: 'International',
    images: [
      {
        id: 'photo-1586861635167-e5223aadc9fe',
        url: buildImageUrl('photo-1586861635167-e5223aadc9fe'),
        alt: 'Sigiriya ancient Lion Rock fortress surrounded by green jungle in Sri Lanka',
        photographer: 'Dylan Shaw',
        photographerUrl: 'https://unsplash.com/@dylanshaw',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1546708973-b339540b5162',
        url: buildImageUrl('photo-1546708973-b339540b5162'),
        alt: 'Nine Arches Bridge in Ella Sri Lanka with blue train passing through tea hills',
        photographer: 'Hedda Virpen',
        photographerUrl: 'https://unsplash.com/@heddavirpen',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1571401835393-8c5f35328320',
        url: buildImageUrl('photo-1571401835393-8c5f35328320'),
        alt: 'Rolling emerald green tea estates in Nuwara Eliya highlands Sri Lanka',
        photographer: 'Sander Weeteling',
        photographerUrl: 'https://unsplash.com/@sanderweeteling',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1578632767115-351597cf2477',
        url: buildImageUrl('photo-1578632767115-351597cf2477'),
        alt: 'Galle Dutch Fort white lighthouse along the Indian Ocean ramparts',
        photographer: 'Sander Weeteling',
        photographerUrl: 'https://unsplash.com/@sanderweeteling',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-maldives': {
    destinationId: 'int-maldives',
    destinationName: 'Maldives Island Retreat',
    country: 'Maldives',
    cityOrRegion: 'Malé Atoll',
    category: 'International',
    images: [
      {
        id: 'photo-1514282401047-d79a71a590e8',
        url: buildImageUrl('photo-1514282401047-d79a71a590e8'),
        alt: 'Luxury overwater thatched bungalow villas over turquoise lagoon in Maldives',
        photographer: 'Sara Dubler',
        photographerUrl: 'https://unsplash.com/@saradubler',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1573843981267-be1999ff37cd',
        url: buildImageUrl('photo-1573843981267-be1999ff37cd'),
        alt: 'Aerial view of tropical coral atoll surrounded by crystalline blue sea in Maldives',
        photographer: 'Shifaaz shamoon',
        photographerUrl: 'https://unsplash.com/@sotti',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Pure white-sand beach and coconut palms with azure ocean gentle waves',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Snorkeler exploring colourful coral reef with clear warm waters in Maldives',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-lakshadweep': {
    destinationId: 'int-lakshadweep',
    destinationName: 'Lakshadweep Coral Atolls',
    country: 'India',
    cityOrRegion: 'Lakshadweep',
    category: 'International',
    images: [
      {
        id: 'photo-1590523741831-ab7e8b8f9c7f',
        url: buildImageUrl('photo-1590523741831-ab7e8b8f9c7f'),
        alt: 'Agatti Island turquoise lagoon and coral reefs in Lakshadweep',
        photographer: 'Babu G',
        photographerUrl: 'https://unsplash.com/@babug',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Bangaram Island crystal clear waters and untouched white sandy shoreline',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Scuba diving in the vibrant coral gardens of Lakshadweep islands',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1582967788606-a171c1080cb0',
        url: buildImageUrl('photo-1582967788606-a171c1080cb0'),
        alt: 'Tropical coral garden and marine sanctuary in Lakshadweep lagoon',
        photographer: 'David Clode',
        photographerUrl: 'https://unsplash.com/@davidclode',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-vietnam': {
    destinationId: 'int-vietnam',
    destinationName: 'Vietnam Discovery',
    country: 'Vietnam',
    cityOrRegion: 'Ha Long & Hoi An',
    category: 'International',
    images: [
      {
        id: 'photo-1528127269322-539801943592',
        url: buildImageUrl('photo-1528127269322-539801943592'),
        alt: 'Ha Long Bay emerald green waters and limestone karst islands in Vietnam',
        photographer: 'Ammy K',
        photographerUrl: 'https://unsplash.com/@ammyk',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1555939594-58d7cb561ad1',
        url: buildImageUrl('photo-1555939594-58d7cb561ad1'),
        alt: 'Hoi An ancient town streets glowing with colourful silk lanterns',
        photographer: 'Tron Le',
        photographerUrl: 'https://unsplash.com/@tronle',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1509042239860-f550ce710b93',
        url: buildImageUrl('photo-1509042239860-f550ce710b93'),
        alt: 'Golden Hand Bridge held by giant stone hands at Ba Na Hills Da Nang',
        photographer: 'Quang Nguyen Vinh',
        photographerUrl: 'https://unsplash.com/@quangphotos',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506665531195-3566af2b4dfa',
        url: buildImageUrl('photo-1506665531195-3566af2b4dfa'),
        alt: 'Hanoi vibrant street life and historical colonial quarters in Vietnam',
        photographer: 'Mike Enerio',
        photographerUrl: 'https://unsplash.com/@mikeenerio',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-baku': {
    destinationId: 'int-baku',
    destinationName: 'Baku City of Winds',
    country: 'Azerbaijan',
    cityOrRegion: 'Baku',
    category: 'International',
    images: [
      {
        id: 'photo-1584646098378-0874589d76b1',
        url: buildImageUrl('photo-1584646098378-0874589d76b1'),
        alt: 'Flame Towers soaring over Baku skyline and Caspian Sea coast at dusk',
        photographer: 'Lloyd Alozie',
        photographerUrl: 'https://unsplash.com/@lloydalozie',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1568605117036-5fe5e7bab0b7',
        url: buildImageUrl('photo-1568605117036-5fe5e7bab0b7'),
        alt: 'Heydar Aliyev Center futuristic white flowing architecture in Baku',
        photographer: 'Elnur Babayev',
        photographerUrl: 'https://unsplash.com/@elnurbabayev',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544620347-c4fd4a3d5957',
        url: buildImageUrl('photo-1544620347-c4fd4a3d5957'),
        alt: 'Icherisheher UNESCO Old City medieval fortress walls in Baku',
        photographer: 'Ant Rozetsky',
        photographerUrl: 'https://unsplash.com/@rozetsky',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1469854523086-cc02fe5d8800',
        url: buildImageUrl('photo-1469854523086-cc02fe5d8800'),
        alt: 'Caspian sea coastal highway and Caucasian foothills in Azerbaijan',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-bhutan': {
    destinationId: 'int-bhutan',
    destinationName: 'Bhutan Himalayan Kingdom',
    country: 'Bhutan',
    cityOrRegion: 'Paro & Thimphu',
    category: 'International',
    images: [
      {
        id: 'photo-1601288496920-b6154fe3626a',
        url: buildImageUrl('photo-1601288496920-b6154fe3626a'),
        alt: 'Paro Taktsang Tiger’s Nest Monastery perched on granite cliff in Bhutan',
        photographer: 'Adli Wahid',
        photographerUrl: 'https://unsplash.com/@adliwahid',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1578632767115-351597cf2477',
        url: buildImageUrl('photo-1578632767115-351597cf2477'),
        alt: 'Majestic Punakha Dzong palace fortress at the confluence of rivers in Bhutan',
        photographer: 'Sander Weeteling',
        photographerUrl: 'https://unsplash.com/@sanderweeteling',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544735716-392fe2489ffa',
        url: buildImageUrl('photo-1544735716-392fe2489ffa'),
        alt: 'Dochula Pass memorial chortens and fluttering prayer flags overlooking Himalayas',
        photographer: 'Prashant Sharma',
        photographerUrl: 'https://unsplash.com/@prashant',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1464822759023-fed622ff2c3b',
        url: buildImageUrl('photo-1464822759023-fed622ff2c3b'),
        alt: 'Pristine Himalayan valleys and pine-covered mountain slopes of Bhutan',
        photographer: 'Kalen Emsley',
        photographerUrl: 'https://unsplash.com/@kalenemsley',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'int-cruise': {
    destinationId: 'int-cruise',
    destinationName: 'Luxury Cruise Line Voyage',
    country: 'International',
    cityOrRegion: 'Open Ocean',
    category: 'International',
    images: [
      {
        id: 'photo-1548574505-5e239809ee19',
        url: buildImageUrl('photo-1548574505-5e239809ee19'),
        alt: 'Modern luxury ocean cruise liner sailing on deep azure open waters',
        photographer: 'Fernando Jorge',
        photographerUrl: 'https://unsplash.com/@fernandojorge',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1505118380757-91f5f5632de0',
        url: buildImageUrl('photo-1505118380757-91f5f5632de0'),
        alt: 'Golden sunset view over calm blue ocean from cruise ship deck',
        photographer: 'Austin Neill',
        photographerUrl: 'https://unsplash.com/@austinneill',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1516483638261-f4dbaf036963',
        url: buildImageUrl('photo-1516483638261-f4dbaf036963'),
        alt: 'Scenic coastal port arrival with colourful houses during cruise journey',
        photographer: 'Jack Ward',
        photographerUrl: 'https://unsplash.com/@jackward',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1512100356356-de1b84283e18',
        url: buildImageUrl('photo-1512100356356-de1b84283e18'),
        alt: 'Panoramic ocean view and coastline from cruise liner deck',
        photographer: 'Aron Visuals',
        photographerUrl: 'https://unsplash.com/@aronvisuals',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOMESTIC & MOUNTAIN EXPEDITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  'dom-kashmir-himachal': {
    destinationId: 'dom-kashmir-himachal',
    destinationName: 'Kashmir & Himachal Paradise',
    country: 'India',
    cityOrRegion: 'Jammu & Kashmir / Himachal',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1610041321327-b794c052db27',
        url: buildImageUrl('photo-1610041321327-b794c052db27'),
        alt: 'Dal Lake traditional wooden Shikara boat with reflection in Srinagar Kashmir',
        photographer: 'Aaqib Bhat',
        photographerUrl: 'https://unsplash.com/@aaqibbhat',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1464822759023-fed622ff2c3b',
        url: buildImageUrl('photo-1464822759023-fed622ff2c3b'),
        alt: 'Gulmarg snowy mountain meadows and majestic Himalayan peaks',
        photographer: 'Kalen Emsley',
        photographerUrl: 'https://unsplash.com/@kalenemsley',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1476514525535-07fb3b4ae5f1',
        url: buildImageUrl('photo-1476514525535-07fb3b4ae5f1'),
        alt: 'Betaab Valley Pahalgam crystal mountain stream flowing through pine hills',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1470071459604-3b5ec3a7fe05',
        url: buildImageUrl('photo-1470071459604-3b5ec3a7fe05'),
        alt: 'Misty sunrise over alpine valleys in Himachal Pradesh',
        photographer: 'Vadim Sherbakov',
        photographerUrl: 'https://unsplash.com/@madebyvadim',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-goa': {
    destinationId: 'dom-goa',
    destinationName: 'Goa Coastal Getaway',
    country: 'India',
    cityOrRegion: 'Goa',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1512343879784-a960bf40e7f2',
        url: buildImageUrl('photo-1512343879784-a960bf40e7f2'),
        alt: 'Palolem Beach curved sandy bay lined with coconut palms in South Goa',
        photographer: 'Sumit Mangela',
        photographerUrl: 'https://unsplash.com/@sumitmangela',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1582510003544-4d00b7f74220',
        url: buildImageUrl('photo-1582510003544-4d00b7f74220'),
        alt: 'Colourful Portuguese heritage quarters and villas in Fontainhas Panaji Goa',
        photographer: 'Sylwia Bartyzel',
        photographerUrl: 'https://unsplash.com/@sylwiabartyzel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1432405972618-c60b0225b8f9',
        url: buildImageUrl('photo-1432405972618-c60b0225b8f9'),
        alt: 'Dudhsagar waterfall roaring through lush jungle greenery in Goa',
        photographer: 'Willian Justen de Vasconcellos',
        photographerUrl: 'https://unsplash.com/@willianjusten',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Sunset boat sailing along the golden Arabian Sea coast in Goa',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-kerala': {
    destinationId: 'dom-kerala',
    destinationName: 'Kerala God’s Own Country',
    country: 'India',
    cityOrRegion: 'Kerala',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1602216056096-3b40cc0c9944',
        url: buildImageUrl('photo-1602216056096-3b40cc0c9944'),
        alt: 'Traditional Kettuvallam wooden houseboat cruising in Alleppey backwaters Kerala',
        photographer: 'Vivek Sharma',
        photographerUrl: 'https://unsplash.com/@vivek',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1571401835393-8c5f35328320',
        url: buildImageUrl('photo-1571401835393-8c5f35328320'),
        alt: 'Rolling mist-covered emerald tea gardens in Munnar highlands Kerala',
        photographer: 'Sander Weeteling',
        photographerUrl: 'https://unsplash.com/@sanderweeteling',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1476514525535-07fb3b4ae5f1',
        url: buildImageUrl('photo-1476514525535-07fb3b4ae5f1'),
        alt: 'Palm-fringed tranquil backwater canal with local fisherman canoe',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1441974231531-c6227db76b6e',
        url: buildImageUrl('photo-1441974231531-c6227db76b6e'),
        alt: 'Athirappilly jungle waterfalls and dense Western Ghats rainforest in Kerala',
        photographer: 'Lukasz Szmigiel',
        photographerUrl: 'https://unsplash.com/@szmigieldesign',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-andaman': {
    destinationId: 'dom-andaman',
    destinationName: 'Andaman Island Wonders',
    country: 'India',
    cityOrRegion: 'Andaman & Nicobar',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1507525428034-b723cf961d3e',
        url: buildImageUrl('photo-1507525428034-b723cf961d3e'),
        alt: 'Radhanagar Beach Havelock Island turquoise water and pure white sand in Andaman',
        photographer: 'Sean Oulashin',
        photographerUrl: 'https://unsplash.com/@seanoulashin',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1524492412937-b28074a5d7da',
        url: buildImageUrl('photo-1524492412937-b28074a5d7da'),
        alt: 'Historic monument facade representing heritage landmarks in India',
        photographer: 'Sylwia Bartyzel',
        photographerUrl: 'https://unsplash.com/@sylwiabartyzel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544551763-46a013bb70d5',
        url: buildImageUrl('photo-1544551763-46a013bb70d5'),
        alt: 'Elephant Beach coral reefs and shallow turquoise water for snorkeling in Andaman',
        photographer: 'Cristian Palmer',
        photographerUrl: 'https://unsplash.com/@cristianpalmer',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1582967788606-a171c1080cb0',
        url: buildImageUrl('photo-1582967788606-a171c1080cb0'),
        alt: 'Natural living coral reefs and marine life around Neil Island Andaman',
        photographer: 'David Clode',
        photographerUrl: 'https://unsplash.com/@davidclode',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-seven-sisters': {
    destinationId: 'dom-seven-sisters',
    destinationName: 'Seven Sisters North East India',
    country: 'India',
    cityOrRegion: 'North East India',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1441974231531-c6227db76b6e',
        url: buildImageUrl('photo-1441974231531-c6227db76b6e'),
        alt: 'Living Root Bridges and lush tropical rainforests of Cherrapunji Meghalaya',
        photographer: 'Lukasz Szmigiel',
        photographerUrl: 'https://unsplash.com/@szmigieldesign',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1546182990-dffeafbe841d',
        url: buildImageUrl('photo-1546182990-dffeafbe841d'),
        alt: 'Wildlife sanctuary wilderness and grasslands of Kaziranga Assam',
        photographer: 'Clément Falize',
        photographerUrl: 'https://unsplash.com/@clementfalize',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1476514525535-07fb3b4ae5f1',
        url: buildImageUrl('photo-1476514525535-07fb3b4ae5f1'),
        alt: 'Crystal clear Umngot River at Dawki Meghalaya where boats float on air',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1465056836041-7f43ac27dcb5',
        url: buildImageUrl('photo-1465056836041-7f43ac27dcb5'),
        alt: 'Tawang high altitude mountain monastery nestled in Arunachal Himalayas',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-sikkim': {
    destinationId: 'dom-sikkim',
    destinationName: 'Sikkim & Kanchenjunga',
    country: 'India',
    cityOrRegion: 'Sikkim',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1465056836041-7f43ac27dcb5',
        url: buildImageUrl('photo-1465056836041-7f43ac27dcb5'),
        alt: 'Sacred Tsomgo (Changu) glacial alpine lake in East Sikkim',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1464822759023-fed622ff2c3b',
        url: buildImageUrl('photo-1464822759023-fed622ff2c3b'),
        alt: 'Magnificent sunrise view of Mount Kanchenjunga snow summit from Sikkim',
        photographer: 'Kalen Emsley',
        photographerUrl: 'https://unsplash.com/@kalenemsley',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1470071459604-3b5ec3a7fe05',
        url: buildImageUrl('photo-1470071459604-3b5ec3a7fe05'),
        alt: 'Misty green valleys and Buddhist prayer flags near Rumtek Monastery',
        photographer: 'Vadim Sherbakov',
        photographerUrl: 'https://unsplash.com/@madebyvadim',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1500530855697-b586d89ba3ee',
        url: buildImageUrl('photo-1500530855697-b586d89ba3ee'),
        alt: 'Yumthang Valley of Flowers high mountain meadow in North Sikkim',
        photographer: 'Felix Rostig',
        photographerUrl: 'https://unsplash.com/@felixrostig',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'dom-rajasthan': {
    destinationId: 'dom-rajasthan',
    destinationName: 'Royal Rajasthan Heritage',
    country: 'India',
    cityOrRegion: 'Rajasthan',
    category: 'Domestic',
    images: [
      {
        id: 'photo-1477587458883-47145ed94245',
        url: buildImageUrl('photo-1477587458883-47145ed94245'),
        alt: 'Majestic Amber Fort overlooking Maota Lake in Jaipur Rajasthan',
        photographer: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1524492412937-b28074a5d7da',
        url: buildImageUrl('photo-1524492412937-b28074a5d7da'),
        alt: 'Iconic royal heritage palace architecture of Rajasthan',
        photographer: 'Sylwia Bartyzel',
        photographerUrl: 'https://unsplash.com/@sylwiabartyzel',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1577717903315-1691ae25ab3f',
        url: buildImageUrl('photo-1577717903315-1691ae25ab3f'),
        alt: 'Lake Pichola City Palace and havelis in romantic Udaipur Rajasthan',
        photographer: 'Annie Spratt',
        photographerUrl: 'https://unsplash.com/@anniespratt',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1451337516015-6b6e9a44a8a3',
        url: buildImageUrl('photo-1451337516015-6b6e9a44a8a3'),
        alt: 'Camel caravan traversing the golden sand dunes of Thar Desert Rajasthan',
        photographer: 'Federico Respini',
        photographerUrl: 'https://unsplash.com/@federicorespini',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'mtn-manali-leh': {
    destinationId: 'mtn-manali-leh',
    destinationName: 'Manali – Leh Motorcycle Expedition',
    country: 'India',
    cityOrRegion: 'Himachal & Ladakh',
    category: 'Mountain',
    images: [
      {
        id: 'photo-1558981806-ec527fa84c39',
        url: buildImageUrl('photo-1558981806-ec527fa84c39'),
        alt: 'Adventure motorcycle rider navigating high Himalayan mountain pass road',
        photographer: 'Harley-Davidson',
        photographerUrl: 'https://unsplash.com/@harleydavidson',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1469854523086-cc02fe5d8800',
        url: buildImageUrl('photo-1469854523086-cc02fe5d8800'),
        alt: 'Winding mountain highway through high-altitude barren Himalayan passes',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1626621341517-bbf3d9990a23',
        url: buildImageUrl('photo-1626621341517-bbf3d9990a23'),
        alt: 'Zanskar river valley and rugged arid mountains along Leh highway',
        photographer: 'Siddharth Soni',
        photographerUrl: 'https://unsplash.com/@siddharth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544731612-de7f96afe55f',
        url: buildImageUrl('photo-1544731612-de7f96afe55f'),
        alt: 'High-altitude expedition mountain peaks and base camp in Ladakh',
        photographer: 'Khatam Ghazali',
        photographerUrl: 'https://unsplash.com/@khatamghazali',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'mtn-leh-ladakh': {
    destinationId: 'mtn-leh-ladakh',
    destinationName: 'Leh – Ladakh Biking & Exploration',
    country: 'India',
    cityOrRegion: 'Ladakh',
    category: 'Mountain',
    images: [
      {
        id: 'photo-1626621341517-bbf3d9990a23',
        url: buildImageUrl('photo-1626621341517-bbf3d9990a23'),
        alt: 'Pangong Tso vibrant blue high-altitude salt lake surrounded by barren peaks',
        photographer: 'Siddharth Soni',
        photographerUrl: 'https://unsplash.com/@siddharth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1544731612-de7f96afe55f',
        url: buildImageUrl('photo-1544731612-de7f96afe55f'),
        alt: 'Thiksey Buddhist Monastery tiered hillside gompa overlooking Indus valley',
        photographer: 'Khatam Ghazali',
        photographerUrl: 'https://unsplash.com/@khatamghazali',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1469854523086-cc02fe5d8800',
        url: buildImageUrl('photo-1469854523086-cc02fe5d8800'),
        alt: 'Nubra Valley cold desert sand dunes and dramatic mountain passes',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1483728642387-6c3bdd6c93e5',
        url: buildImageUrl('photo-1483728642387-6c3bdd6c93e5'),
        alt: 'Snow-clad Himalayan ranges bordering the high Indus valley in Ladakh',
        photographer: 'Dino Reichmuth',
        photographerUrl: 'https://unsplash.com/@dinoreichmuth',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'mtn-mountaineering-expedition': {
    destinationId: 'mtn-mountaineering-expedition',
    destinationName: 'Mountaineering Expedition',
    country: 'International & India',
    cityOrRegion: 'High Alpine Peaks',
    category: 'Mountain',
    images: [
      {
        id: 'photo-1454496522488-7a8e488e8606',
        url: buildImageUrl('photo-1454496522488-7a8e488e8606'),
        alt: 'Mountaineers roped up ascending steep snowy ridge on alpine summit',
        photographer: 'Jerry Zhang',
        photographerUrl: 'https://unsplash.com/@z铲',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1506905925346-21bda4d32df4',
        url: buildImageUrl('photo-1506905925346-21bda4d32df4'),
        alt: 'Dramatic summit peaks rising above sea of clouds in alpine mountain range',
        photographer: 'Didier Weemaels',
        photographerUrl: 'https://unsplash.com/@didierweemaels',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1551632811-561732d1e306',
        url: buildImageUrl('photo-1551632811-561732d1e306'),
        alt: 'High altitude glacial crossing with ice axes and technical gear',
        photographer: 'Toa Heftiba',
        photographerUrl: 'https://unsplash.com/@heftiba',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1510312305653-8ed496efae75',
        url: buildImageUrl('photo-1510312305653-8ed496efae75'),
        alt: 'Summit base camp illuminated under star-filled high altitude night sky',
        photographer: 'Cliford Mervil',
        photographerUrl: 'https://unsplash.com/@clifordmervil',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },

  'mtn-trekking-camping': {
    destinationId: 'mtn-trekking-camping',
    destinationName: 'Trekking & High Altitude Camping',
    country: 'International & India',
    cityOrRegion: 'High Valleys',
    category: 'Mountain',
    images: [
      {
        id: 'photo-1501785888041-af3ef285b470',
        url: buildImageUrl('photo-1501785888041-af3ef285b470'),
        alt: 'Pristine glacial alpine tarn surrounded by jagged snow peaks',
        photographer: 'Pietro De Grandi',
        photographerUrl: 'https://unsplash.com/@pietro_de_grandi',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1478131143081-80f7f84ca84d',
        url: buildImageUrl('photo-1478131143081-80f7f84ca84d'),
        alt: 'Campers tent pitched in forest clearing with warm sunset glow',
        photographer: 'Scott Goodwill',
        photographerUrl: 'https://unsplash.com/@scottgoodwill',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1486870591958-9b9d0d1dda99',
        url: buildImageUrl('photo-1486870591958-9b9d0d1dda99'),
        alt: 'Hikers walking single file along a panoramic mountain ridge path',
        photographer: 'Christopher Burns',
        photographerUrl: 'https://unsplash.com/@christopherburns',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
      {
        id: 'photo-1470071459604-3b5ec3a7fe05',
        url: buildImageUrl('photo-1470071459604-3b5ec3a7fe05'),
        alt: 'Early morning sunlight piercing through misty alpine mountain valley',
        photographer: 'Vadim Sherbakov',
        photographerUrl: 'https://unsplash.com/@madebyvadim',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        width: 1000,
        height: 700,
      },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// ALIAS & ID MAPPING
// Maps database IDs, numeric keys, and slugs to legacy candidate records
// ═══════════════════════════════════════════════════════════════════════════

const aliasMap = {
  // Numeric data.js tour IDs
  '1': 'int-bali',
  '2': 'int-europe',
  '3': 'int-dubai',
  '4': 'int-europe',
  '5': 'int-maldives',
  '6': 'int-europe',

  // Database Adventure IDs
  'adv-1': 'adv-brahmatal',
  'adv-2': 'adv-kedarkantha',
  'adv-3': 'adv-chopta-rishikesh',
  'adv-4': 'adv-manali-kasol',
  'adv-5': 'adv-spiti',
  'adv-6': 'adv-manali-camp',
  'adv-7': 'adv-mussoorie',
  'adv-8': 'adv-dalhousie',

  // Database International IDs
  'int-1': 'int-thailand',
  'int-2': 'int-europe',
  'int-3': 'int-bali',
  'int-4': 'int-phuket-krabi',
  'int-5': 'int-singapore-malaysia',
  'int-6': 'int-sri-lanka',
  'int-7': 'int-maldives',
  'int-8': 'int-lakshadweep',
  'int-9': 'int-vietnam',
  'int-10': 'int-baku',
  'int-11': 'int-dubai',
  'int-12': 'int-bhutan',
  'int-13': 'int-cruise',

  // Database Domestic IDs
  'dom-1': 'dom-kashmir-himachal',
  'dom-2': 'dom-goa',
  'dom-3': 'dom-kerala',
  'dom-4': 'dom-andaman',
  'dom-5': 'dom-seven-sisters',
  'dom-6': 'dom-sikkim',
  'dom-7': 'dom-rajasthan',
  'dom-8': 'mtn-manali-leh',
  'dom-9': 'mtn-leh-ladakh',

  // Database Camping IDs
  'camp-1': 'camp-gir',
  'camp-2': 'camp-gir',
  'camp-3': 'camp-marine',
  'camp-4': 'camp-marine',
  'camp-5': 'camp-marine',
  'camp-6': 'adv-saputara',
  'camp-7': 'adv-beyt-dwarka',
  'camp-8': 'adv-jaisalmer',

  // Family & Solo slugs
  'fam-1': 'dom-kashmir-himachal',
  'fam-2': 'dom-andaman',
  'fam-3': 'dom-rajasthan',
  'fam-4': 'dom-sikkim',
  'fam-gir-nature': 'camp-gir',
  'fam-gir-camping': 'camp-gir',
  'fam-customized': 'int-europe',

  'solo-1': 'int-europe',
  'solo-2': 'mtn-manali-leh',
  'solo-3': 'int-thailand',
  'solo-trekking': 'mtn-manali-leh',
  'solo-adventure': 'adv-chopta-rishikesh',
  'solo-customized': 'int-dubai',
}

/**
 * Normalizes an input key (ID, slug, or title) to the matching destination record
 * @param {string|number} key
 * @param {string} [titleOrLocation='']
 * @returns {DestinationRecord|null}
 */
export function resolveDestinationRecord(key, titleOrLocation = '') {
  if (!key && !titleOrLocation) return null

  const cleanKey = String(key || '').trim().toLowerCase()
  const cleanText = `${cleanKey} ${String(titleOrLocation || '').trim().toLowerCase()}`

  // Direct match in registry
  if (destinationRegistry[cleanKey]) {
    return destinationRegistry[cleanKey]
  }

  // Match in alias table
  if (aliasMap[cleanKey] && destinationRegistry[aliasMap[cleanKey]]) {
    return destinationRegistry[aliasMap[cleanKey]]
  }

  // Text / Keyword matching
  if (cleanText.includes('kedarkantha')) return destinationRegistry['adv-kedarkantha']
  if (cleanText.includes('chopta') || cleanText.includes('rishikesh')) return destinationRegistry['adv-chopta-rishikesh']
  if (cleanText.includes('kasol') || (cleanText.includes('manali') && cleanText.includes('backpacking'))) return destinationRegistry['adv-manali-kasol']
  if (cleanText.includes('dalhousie')) return destinationRegistry['adv-dalhousie']
  if (cleanText.includes('mussoorie')) return destinationRegistry['adv-mussoorie']
  if (cleanText.includes('manali adventure camp') || (cleanText.includes('manali') && cleanText.includes('camp'))) return destinationRegistry['adv-manali-camp']
  if (cleanText.includes('brahmatal')) return destinationRegistry['adv-brahmatal']
  if (cleanText.includes('spiti')) return destinationRegistry['adv-spiti']
  if (cleanText.includes('jaisalmer') || cleanText.includes('thar desert')) return destinationRegistry['adv-jaisalmer']
  if (cleanText.includes('saputara')) return destinationRegistry['adv-saputara']
  if (cleanText.includes('dwarka') || cleanText.includes('beyt')) return destinationRegistry['adv-beyt-dwarka']
  if (cleanText.includes('gir') || cleanText.includes('lion')) return destinationRegistry['camp-gir']
  if (cleanText.includes('pirotan') || cleanText.includes('narara') || cleanText.includes('marine')) return destinationRegistry['camp-marine']

  if (cleanText.includes('dubai')) return destinationRegistry['int-dubai']
  if (cleanText.includes('thailand') || cleanText.includes('bangkok')) return destinationRegistry['int-thailand']
  if (cleanText.includes('bali')) return destinationRegistry['int-bali']
  if (cleanText.includes('europe') || cleanText.includes('paris') || cleanText.includes('swiss')) return destinationRegistry['int-europe']
  if (cleanText.includes('phuket') || cleanText.includes('krabi')) return destinationRegistry['int-phuket-krabi']
  if (cleanText.includes('singapore') || cleanText.includes('malaysia')) return destinationRegistry['int-singapore-malaysia']
  if (cleanText.includes('sri lanka')) return destinationRegistry['int-sri-lanka']
  if (cleanText.includes('maldives')) return destinationRegistry['int-maldives']
  if (cleanText.includes('lakshadweep')) return destinationRegistry['int-lakshadweep']
  if (cleanText.includes('vietnam')) return destinationRegistry['int-vietnam']
  if (cleanText.includes('baku') || cleanText.includes('azerbaijan')) return destinationRegistry['int-baku']
  if (cleanText.includes('bhutan')) return destinationRegistry['int-bhutan']
  if (cleanText.includes('cruise')) return destinationRegistry['int-cruise']

  if (cleanText.includes('kashmir') || cleanText.includes('gulmarg') || cleanText.includes('srinagar')) return destinationRegistry['dom-kashmir-himachal']
  if (cleanText.includes('goa')) return destinationRegistry['dom-goa']
  if (cleanText.includes('kerala') || cleanText.includes('alleppey') || cleanText.includes('munnar')) return destinationRegistry['dom-kerala']
  if (cleanText.includes('andaman') || cleanText.includes('havelock') || cleanText.includes('port blair')) return destinationRegistry['dom-andaman']
  if (cleanText.includes('seven sisters') || cleanText.includes('meghalaya') || cleanText.includes('assam') || cleanText.includes('kaziranga')) return destinationRegistry['dom-seven-sisters']
  if (cleanText.includes('sikkim') || cleanText.includes('kanchenjunga') || cleanText.includes('gangtok')) return destinationRegistry['dom-sikkim']
  if (cleanText.includes('rajasthan') || cleanText.includes('jaipur') || cleanText.includes('udaipur')) return destinationRegistry['dom-rajasthan']
  if (cleanText.includes('manali – leh') || cleanText.includes('manali to leh') || (cleanText.includes('biking') && cleanText.includes('manali'))) return destinationRegistry['mtn-manali-leh']
  if (cleanText.includes('ladakh') || cleanText.includes('leh')) return destinationRegistry['mtn-leh-ladakh']

  return null
}

/**
 * Retrieve legacy candidate image records for a destination
 * @param {string|number} key
 * @param {string} [titleOrLocation='']
 * @returns {DestinationPhoto[]}
 */
export function getDestinationImages(key, titleOrLocation = '') {
  const record = resolveDestinationRecord(key, titleOrLocation)
  if (record && Array.isArray(record.images) && record.images.length > 0) {
    return record.images
  }
  return []
}

/**
 * Retrieve legacy candidate image URLs for a destination
 * @param {string|number} key
 * @param {string} [titleOrLocation='']
 * @returns {string[]}
 */
export function getDestinationImageUrls(key, titleOrLocation = '') {
  const photos = getDestinationImages(key, titleOrLocation)
  return photos.map((p) => p.url)
}

/**
 * Retrieve primary cover photo for any destination
 * @param {string|number} key
 * @param {string} [titleOrLocation='']
 * @returns {string}
 */
export function getDestinationCover(key, titleOrLocation = '') {
  const photos = getDestinationImages(key, titleOrLocation)
  return photos[0]?.url || ''
}

/**
 * Backward compatibility export for legacy tourImages dictionary
 * Keys map to legacy candidate URLs; they are not provider-verified.
 */
export const tourImages = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (typeof prop !== 'string') return undefined
      const record = resolveDestinationRecord(prop)
      if (record) {
        return record.images.map((img) => img.url)
      }
      return undefined
    },
    has: (_, prop) => {
      return typeof prop === 'string' && !!resolveDestinationRecord(prop)
    },
  }
)

/**
 * Structural registry check. This does not verify image content, licensing, or location.
 * @returns {{ valid: boolean, errors: string[], totalDestinations: number }}
 */
export function validateDestinationImageRegistry() {
  const errors = []
  const allDestinations = Object.values(destinationRegistry)

  for (const dest of allDestinations) {
    if (!Array.isArray(dest.images) || dest.images.length !== 4) {
      errors.push(`Destination ${dest.destinationId} has ${dest.images?.length || 0} images (expected 4)`)
    }

    const idSet = new Set()
    for (const img of dest.images || []) {
      if (!img.id || !img.url) {
        errors.push(`Destination ${dest.destinationId} has image missing ID or URL`)
      }
      if (idSet.has(img.id)) {
        errors.push(`Destination ${dest.destinationId} has duplicate image ID: ${img.id}`)
      }
      idSet.add(img.id)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    totalDestinations: allDestinations.length,
  }
}
