const U = (id, w = 500, h = 360) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`

export const IMAGE_PRESETS = {
  international: [
    { label: 'Bali', url: U('photo-1537996194471-e657df975ab4') },
    { label: 'Maldives', url: U('photo-1514282401047-d79a71a590e8') },
    { label: 'Dubai', url: U('photo-1518684079-3c830dcef090') },
    { label: 'Thailand', url: U('photo-1528181304800-259b08848526') },
    { label: 'Europe', url: U('photo-1499856871958-5b9627545d1a') },
    { label: 'Vietnam', url: U('photo-1528127269322-539801943592') },
    { label: 'Cruise', url: U('photo-1548574505-5e239809ee19') },
    { label: 'Sri Lanka', url: U('photo-1552465011-b4e21bf6e79a') },
  ],
  domestic: [
    { label: 'Kashmir', url: U('photo-1610041321327-b794c052db27') },
    { label: 'Goa', url: U('photo-1512343879784-a960bf40e7f2') },
    { label: 'Kerala', url: U('photo-1602216056096-3b40cc0c9944') },
    { label: 'Andaman', url: U('photo-1544735716-392fe2489ffa') },
    { label: 'Rajasthan', url: U('photo-1477587458883-47145ed94245') },
    { label: 'Ladakh', url: U('photo-1544731612-de7f96afe55f') },
  ],
  adventure: [
    { label: 'Snow Trek', url: U('photo-1464822759023-fed622ff2c3b') },
    { label: 'Summit', url: U('photo-1454496522488-7a8e488e8606') },
    { label: 'Mountains', url: U('photo-1506905925346-21bda4d32df4') },
    { label: 'Camp', url: U('photo-1551632811-561732d1e306') },
    { label: 'Hiking', url: U('photo-1551632811-561732d1e306') },
    { label: 'Forest', url: U('photo-1441974231531-c6227db76b6e') },
  ],
  camping: [
    { label: 'Lion', url: U('photo-1546182990-dffeafbe841d') },
    { label: 'Tent', url: U('photo-1478131143081-80f7f84ca84d') },
    { label: 'Marine', url: U('photo-1582967788606-a171c1080cb0') },
    { label: 'Beach', url: U('photo-1507525428034-b723cf961d3e') },
    { label: 'Forest', url: U('photo-1470071459604-3b5ec3a7fe05') },
    { label: 'Desert', url: U('photo-1521133573892-e44906baee46') },
    { label: 'Boat', url: U('photo-1544551763-46a013bb70d5') },
  ],
  blog: [
    { label: 'Himalayas', url: U('photo-1464822759023-fed622ff2c3b', 800, 400) },
    { label: 'Maldives', url: U('photo-1514282401047-d79a71a590e8', 800, 400) },
    { label: 'Camping', url: U('photo-1478131143081-80f7f84ca84d', 800, 400) },
    { label: 'Mountains', url: U('photo-1506905925346-21bda4d32df4', 800, 400) },
  ],
  general: [
    { label: 'Compass', url: U('photo-1527853787696-f7be74f2e39a') },
    { label: 'Map', url: U('photo-1503220317375-aaad61436b1b') },
    { label: 'Packing', url: U('photo-1500530855697-b586d89ba3ee') },
  ],
}