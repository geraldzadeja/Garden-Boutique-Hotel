export const roomTypes = [
  {
    id: "deluxe-double",
    name: "Deluxe Double Room",
    slug: "deluxe-double-room",
    description: "Spacious room with one double bed, city view, and premium amenities",
    shortDescription: "Spacious double room with city view and premium amenities.",
    fullDescription: "Experience luxury in our Deluxe Double Room featuring a plush king-size bed, panoramic city views, marble en-suite bathroom, and a curated selection of premium amenities for an unforgettable stay.",
    totalRooms: 8,
    availableRooms: 5,
    basePrice: "€280",
    pricePerNight: 280,
    maxGuests: 2,
    size: 35,
    bedType: "King Size Bed",
    displayOrder: 1,
    status: "Active",
    amenities: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "City View", "Safe"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
  },
  {
    id: "deluxe-twin",
    name: "Deluxe Twin Room",
    slug: "deluxe-twin-room",
    description: "Elegant room with two single beds, garden view, and en-suite bathroom",
    shortDescription: "Elegant twin room with garden view and en-suite bathroom.",
    fullDescription: "Our Deluxe Twin Room offers two comfortable single beds, serene garden views, a modern en-suite bathroom with rainfall shower, and thoughtful amenities for a restful retreat.",
    totalRooms: 6,
    availableRooms: 3,
    basePrice: "€310",
    pricePerNight: 310,
    maxGuests: 2,
    size: 32,
    bedType: "Twin Beds",
    displayOrder: 2,
    status: "Active",
    amenities: ["Wi-Fi", "Air Conditioning", "Garden View", "En-suite Bathroom", "Desk"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d955e4c47"],
  },
  {
    id: "deluxe-triple",
    name: "Deluxe Triple Room",
    slug: "deluxe-triple-room",
    description: "Family-friendly room with three beds, balcony, and lounge area",
    shortDescription: "Family-friendly triple room with balcony and lounge area.",
    fullDescription: "Perfect for families or groups, the Deluxe Triple Room features three beds, a private balcony, a dedicated lounge area, and spacious interiors designed for comfort and convenience.",
    totalRooms: 4,
    availableRooms: 2,
    basePrice: "€420",
    pricePerNight: 420,
    maxGuests: 3,
    size: 48,
    bedType: "One Double + One Single Bed",
    displayOrder: 3,
    status: "Active",
    amenities: ["Wi-Fi", "Air Conditioning", "Balcony", "Lounge Area", "Mini Bar", "Room Service"],
    images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"],
  },
  {
    id: "double-room",
    name: "Double Room",
    slug: "double-room",
    description: "Comfortable standard room with one double bed and modern furnishings",
    shortDescription: "Comfortable standard room with modern furnishings.",
    fullDescription: "Our Double Room provides a comfortable double bed, modern furnishings, and all essential amenities for a pleasant stay at an accessible price point.",
    totalRooms: 12,
    availableRooms: 7,
    basePrice: "€140",
    pricePerNight: 140,
    maxGuests: 2,
    size: 22,
    bedType: "Double Bed",
    displayOrder: 4,
    status: "Active",
    amenities: ["Wi-Fi", "Air Conditioning", "En-suite Bathroom"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304"],
  },
];

export const recentBookings = [
  { id: "BK-1024", guest: "Emily Chen", room: "Suite 301", checkIn: "Feb 10", checkOut: "Feb 14", status: "Confirmed", amount: "$1,840" },
  { id: "BK-1023", guest: "Marcus Johnson", room: "Deluxe 205", checkIn: "Feb 10", checkOut: "Feb 12", status: "Checked-in", amount: "$620" },
  { id: "BK-1022", guest: "Sarah Williams", room: "Standard 102", checkIn: "Feb 11", checkOut: "Feb 13", status: "Pending", amount: "$340" },
  { id: "BK-1021", guest: "Robert Kim", room: "Suite 302", checkIn: "Feb 12", checkOut: "Feb 16", status: "Confirmed", amount: "$2,120" },
  { id: "BK-1020", guest: "Ana Martinez", room: "Deluxe 208", checkIn: "Feb 9", checkOut: "Feb 11", status: "Checked-in", amount: "$580" },
];

export const todayCheckIns = [
  { guest: "Emily Chen", room: "Suite 301", time: "2:00 PM", status: "Confirmed" },
  { guest: "Marcus Johnson", room: "Deluxe 205", time: "3:00 PM", status: "Checked-in" },
  { guest: "Lisa Park", room: "Standard 110", time: "4:00 PM", status: "Pending" },
];

export const allBookings = [
  ...recentBookings,
  { id: "BK-1019", guest: "David Lee", room: "Standard 104", checkIn: "Feb 8", checkOut: "Feb 10", status: "Checked-out", amount: "$280" },
  { id: "BK-1018", guest: "Nina Patel", room: "Suite 303", checkIn: "Feb 7", checkOut: "Feb 9", status: "Cancelled", amount: "$1,560" },
  { id: "BK-1017", guest: "James Wright", room: "Deluxe 210", checkIn: "Feb 6", checkOut: "Feb 8", status: "Checked-out", amount: "$640" },
  { id: "BK-1016", guest: "Sophie Turner", room: "Standard 108", checkIn: "Feb 13", checkOut: "Feb 15", status: "Confirmed", amount: "$310" },
  { id: "BK-1015", guest: "Carlos Rivera", room: "Deluxe 202", checkIn: "Feb 14", checkOut: "Feb 17", status: "Pending", amount: "$930" },
];

export const messages = [
  { id: "M001", from: "Michael Brown", email: "michael@example.com", subject: "Late check-in request", preview: "Hi, I'll be arriving around midnight on Feb 15th. Is late check-in possible?", date: "Feb 10", status: "Unread" },
  { id: "M002", from: "Jennifer Davis", email: "jennifer@example.com", subject: "Wedding venue inquiry", preview: "We're looking for a venue for our wedding reception in June. Do you offer event packages?", date: "Feb 10", status: "Unread" },
  { id: "M003", from: "Tom Wilson", email: "tom@example.com", subject: "Pool hours question", preview: "What are the pool operating hours during February? Also, is the sauna open?", date: "Feb 9", status: "Read" },
  { id: "M004", from: "Rachel Green", email: "rachel@example.com", subject: "Booking modification", preview: "I'd like to extend my stay by two nights. My booking reference is BK-1020.", date: "Feb 9", status: "Read" },
  { id: "M005", from: "Alex Thompson", email: "alex@example.com", subject: "Accessibility features", preview: "Can you please provide information about wheelchair accessibility in your rooms?", date: "Feb 8", status: "Read" },
];

export const revenueData = [
  { month: "Sep", revenue: 42000 },
  { month: "Oct", revenue: 48000 },
  { month: "Nov", revenue: 38000 },
  { month: "Dec", revenue: 56000 },
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 47000 },
];

export const occupancyData = [
  { month: "Sep", rate: 72 },
  { month: "Oct", rate: 81 },
  { month: "Nov", rate: 65 },
  { month: "Dec", rate: 88 },
  { month: "Jan", rate: 79 },
  { month: "Feb", rate: 74 },
];

export const blogPosts = [
  { id: "B001", title: "Top 10 Things to Do Near Our Hotel", author: "John Doe", date: "Feb 8, 2026", status: "Published", views: 1240 },
  { id: "B002", title: "Spring Special: Weekend Getaway Packages", author: "Jane Smith", date: "Feb 5, 2026", status: "Published", views: 890 },
  { id: "B003", title: "New Spa Services Available This March", author: "John Doe", date: "Feb 10, 2026", status: "Draft", views: 0 },
  { id: "B004", title: "Valentine's Day Dinner at Our Restaurant", author: "Jane Smith", date: "Feb 3, 2026", status: "Published", views: 2100 },
  { id: "B005", title: "Guide to Local Wine Country Tours", author: "John Doe", date: "Feb 9, 2026", status: "Draft", views: 0 },
];

export const guests = [
  { id: "G001", name: "Emily Chen", email: "emily@example.com", phone: "+1 555-0101", totalStays: 4, totalSpent: "$6,240", lastStay: "Feb 14, 2026", status: "Current" },
  { id: "G002", name: "Marcus Johnson", email: "marcus@example.com", phone: "+1 555-0102", totalStays: 2, totalSpent: "$1,840", lastStay: "Feb 12, 2026", status: "Current" },
  { id: "G003", name: "Sarah Williams", email: "sarah@example.com", phone: "+1 555-0103", totalStays: 1, totalSpent: "$340", lastStay: "Feb 13, 2026", status: "Upcoming" },
  { id: "G004", name: "Robert Kim", email: "robert@example.com", phone: "+1 555-0104", totalStays: 7, totalSpent: "$12,400", lastStay: "Feb 16, 2026", status: "Upcoming" },
  { id: "G005", name: "Ana Martinez", email: "ana@example.com", phone: "+1 555-0105", totalStays: 3, totalSpent: "$2,180", lastStay: "Feb 11, 2026", status: "Current" },
];
