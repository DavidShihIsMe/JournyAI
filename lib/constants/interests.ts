export interface InterestOption {
  id: string;
  label: string;
  category: string;
}

function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RAW_INTERESTS: Record<string, string[]> = {
  "Food & Dining": [
    "Food & Dining",
    "Street Food",
    "Fine Dining",
    "Coffee & Cafés",
    "Brunch",
    "Bakeries",
    "Cooking Classes",
    "Food Tours",
    "Tastings",
    "Wine & Cocktails",
    "Breweries",
    "Local Cuisine",
    "Markets",
    "Night Markets",
  ],
  "Culture & Arts": [
    "Museums",
    "Art Galleries",
    "History",
    "Architecture",
    "Religious Sites",
    "Temples",
    "Street Art",
    "Cultural Sites",
    "Heritage Tours",
  ],
  Entertainment: [
    "Live Music",
    "Jazz",
    "Electronic Music",
    "Theater",
    "Comedy Shows",
    "Festivals",
    "Concerts",
    "Sports Events",
  ],
  Nightlife: ["Nightlife", "Bars", "Cocktail Bars", "Rooftops", "Dancing", "Clubs"],
  Shopping: [
    "Shopping",
    "Vintage Stores",
    "Boutiques",
    "Local Markets",
    "Bazaars",
    "Malls",
  ],
  "Nature & Outdoors": [
    "Nature",
    "Hiking",
    "Beaches",
    "Mountains",
    "Parks",
    "Gardens",
    "Scenic Views",
    "Wildlife",
    "National Parks",
  ],
  "Adventure & Sports": [
    "Adventure Sports",
    "Diving",
    "Surfing",
    "Water Sports",
    "Kayaking",
    "Rock Climbing",
    "Skiing",
    "Biking",
  ],
  Wellness: ["Yoga & Wellness", "Spas", "Meditation", "Hot Springs", "Thermal Baths"],
  "Neighborhoods & Exploration": [
    "Off the Beaten Path",
    "Hidden Gems",
    "Local Neighborhoods",
    "Walking Tours",
    "Scenic Drives",
  ],
  "Photography & Views": [
    "Photography",
    "Instagram Spots",
    "Viewpoints",
    "Sunsets",
    "Sunrises",
  ],
};

export const INTEREST_OPTIONS: InterestOption[] = Object.entries(RAW_INTERESTS).flatMap(
  ([category, labels]) =>
    labels.map((label) => ({
      id: slug(label),
      label,
      category,
    }))
);

export const INTERESTS: string[] = [
  // Food & Drink
  "Street food", "Fine dining", "Coffee", "Cooking classes", "Wine", "Craft beer",
  "Food markets", "Sushi", "BBQ", "Ramen", "Pizza", "Seafood", "Vegan", "Bakeries",
  "Cocktails", "Whiskey", "Food trucks", "Michelin", "Farm-to-table", "Cheese",
  "Tea", "Natural wine",

  // Outdoors & Nature
  "Hiking", "Beaches", "Camping", "Wildlife", "Safari", "National parks",
  "Scenic drives", "Fishing", "Birdwatching", "Stargazing", "Volcanoes", "Waterfalls",
  "Caves", "Lakes", "Rainforests", "Deserts", "Mountains", "Coastal walks",

  // Adventure & Sports
  "Surfing", "Skiing", "Snowboarding", "Scuba diving", "Snorkeling", "Rock climbing",
  "Cycling", "Kayaking", "Paddleboarding", "Sailing", "Paragliding", "Skydiving",
  "Zip-lining", "Bungee jumping", "Rafting", "Kitesurfing", "Mountain biking",
  "Horseback riding", "Skateboarding", "Jet skiing", "Off-roading",

  // Fitness & Wellness
  "Yoga", "Running", "Marathons", "CrossFit", "Pilates", "Swimming", "Boxing",
  "Martial arts", "Dance", "Golf", "Tennis", "Spas", "Hot springs", "Meditation",
  "Retreats", "Tai chi",

  // Spectator Sports
  "NBA", "NFL", "Premier League", "La Liga", "Champions League", "MLS", "MLB",
  "NHL", "Formula 1", "UFC", "Rugby", "Cricket", "College football",
  "College basketball", "NASCAR", "Olympics", "Wrestling", "Esports",

  // Music
  "Live music", "Concerts", "Music festivals", "Jazz", "Hip-hop", "EDM", "Rock",
  "Indie", "Classical", "Country", "Folk", "Latin music", "R&B", "Afrobeats",
  "K-pop", "Techno", "Blues", "Reggae", "Opera", "Vinyl", "Karaoke",

  // Art & Culture
  "Museums", "Galleries", "History", "Ruins", "Architecture", "Street art",
  "Photography", "Ceramics", "Painting", "Film", "Theater", "Comedy", "Literature",
  "Bookshops", "Fashion", "Calligraphy", "Sculpture", "Tattoos",

  // Nightlife
  "Bars", "Rooftop bars", "Clubs", "Pub crawls", "Speakeasies", "Beach bars",
  "Sports bars", "Hookah",

  // Local Life
  "Local traditions", "Temples", "Shrines", "Volunteering", "Language learning",
  "Local crafts", "Farming", "Cultural festivals", "People-watching",

  // Shopping
  "Markets", "Vintage", "Thrifting", "Luxury shopping", "Flea markets", "Sneakers",
  "Antiques", "Bookstores", "Street vendors",

  // Entertainment
  "Theme parks", "Water parks", "Casinos", "Escape rooms", "Boat parties",
  "Carnivals", "Film festivals", "Art fairs", "Fashion week", "Conventions",
  "Food festivals",

  // Transport
  "Train travel", "Road trips", "Motorcycles", "Van life", "Hot air balloons",
  "Scenic flights",

  // Learning
  "Workshops", "Campus tours", "Archaeology", "Astronomy", "Wine tasting",
  "Historical tours",
];

export const POPULAR_INTERESTS: string[] = [
  "Street food",
  "Hiking",
  "Beaches",
  "Coffee",
  "Museums",
  "Bars",
  "Photography",
  "Live music",
  "Wine",
  "Architecture",
  "Surfing",
  "Fine dining",
  "History",
  "Yoga",
  "Markets",
];
