export interface TravelerTypeInfo {
  code: string;
  name: string;
  tagline: string;
  description: string;
  portrait: string;
  compatibility: string[];
  idealDestinations: string[];
  rarity: string;
  packingStyle: string;
  travelRedFlag: string;
}

export const TRAVELER_TYPES: Record<string, TravelerTypeInfo> = {
  PBCI: {
    code: "PBCI",
    name: "The Director",
    tagline: "Every moment, choreographed.",
    description:
      "You orchestrate every detail of a packed itinerary with precision. You love being in the thick of things — tasting, talking, joining — but always on your terms, with a plan in hand.",
    portrait:
      "You're the one with the color-coded spreadsheet and the 6am wake-up call. You've already researched the best table at the restaurant, the fastest route to the museum, and the local phrase for 'thank you.' Nothing is left to chance — and somehow, you still make it look effortless.",
    compatibility: ["PBDI", "PRCI", "FBCI"],
    idealDestinations: ["Tokyo", "Singapore", "Barcelona"],
    rarity: "Uncommon",
    packingStyle: "Packing cubes, labeled. Outfit for every occasion.",
    travelRedFlag: "Gets tense when the group wants to 'just wing it.'",
  },
  PBCO: {
    code: "PBCO",
    name: "The Collector",
    tagline: "Seen it. Checked it. On to the next.",
    description:
      "You curate a full schedule of carefully chosen experiences to witness. You prefer to take it all in from the outside — observing, photographing, cataloging — with every stop pre-planned.",
    portrait:
      "Your camera roll is impeccable. You've visited more landmarks before noon than most people see in a week. You don't need to chat with the chef — the dish speaks for itself. Every trip is a curated gallery of moments, and you're the curator.",
    compatibility: ["PBDO", "PRCO", "FBCO"],
    idealDestinations: ["Paris", "Kyoto", "Vienna"],
    rarity: "Uncommon",
    packingStyle: "Minimalist but precise. One great outfit per day.",
    travelRedFlag: "Silently judges people who don't research before they go.",
  },
  PBDI: {
    code: "PBDI",
    name: "The Operator",
    tagline: "Planned chaos. Maximum intensity.",
    description:
      "You plan bold, high-intensity adventures and dive in headfirst. You thrive outside your comfort zone and love a packed schedule of raw, immersive experiences.",
    portrait:
      "You booked the 5am volcano hike, the street food crawl through the back alleys, and the night dive — all in one day. You don't just visit places, you conquer them. Your itinerary reads like an action movie script.",
    compatibility: ["PBCI", "FBDI", "PRDI"],
    idealDestinations: ["Medellín", "Kathmandu", "Cape Town"],
    rarity: "Rare",
    packingStyle: "One backpack. Everything quick-dry. No checked bags.",
    travelRedFlag: "Suggests a 'quick 12-mile hike' after an overnight flight.",
  },
  PBDO: {
    code: "PBDO",
    name: "The Documentarian",
    tagline: "Witness everything. Miss nothing.",
    description:
      "You plan a packed schedule to capture and catalog every moment. You find beauty in observing the unfamiliar from a thoughtful distance — always with a plan.",
    portrait:
      "You're the one with the journal, the film camera, and the annotated map. You planned this route through the old quarter specifically for the light at golden hour. You don't need to talk to strangers — the city tells its own story if you know where to look.",
    compatibility: ["PBCO", "FBDO", "PRDO"],
    idealDestinations: ["Havana", "Varanasi", "Fez"],
    rarity: "Rare",
    packingStyle: "Camera gear takes priority. Clothes are an afterthought.",
    travelRedFlag: "Misses the sunset because they were adjusting camera settings.",
  },
  PRCI: {
    code: "PRCI",
    name: "The Artisan",
    tagline: "Slow days. Deep roots.",
    description:
      "You plan a relaxed pace with deep, comfortable cultural immersion. You love connecting with people and places — but on a schedule that leaves room to breathe.",
    portrait:
      "You signed up for the pottery class and the cooking workshop, but you also blocked off the whole afternoon for a nap. You'll chat with the owner of the wine bar for two hours and leave with a dinner invitation. Unhurried, but intentional.",
    compatibility: ["PBCI", "FRCI", "PRDI"],
    idealDestinations: ["Tuscany", "Oaxaca", "Luang Prabang"],
    rarity: "Common",
    packingStyle: "Comfortable layers. A good book. Maybe two.",
    travelRedFlag: "Takes so long at one café that the rest of the plan falls apart.",
  },
  PRCO: {
    code: "PRCO",
    name: "The Connoisseur",
    tagline: "Less is more. But make it exquisite.",
    description:
      "You seek refined, curated experiences enjoyed at a leisurely pace. You know exactly what you want — and you'd rather do three things beautifully than ten things rushed.",
    portrait:
      "You pre-booked the tasting menu, the spa, and the sunset terrace — and that's the entire day. You don't need to try everything. You need to try the right thing. Quality over quantity, always.",
    compatibility: ["PBCO", "FRCO", "PRDO"],
    idealDestinations: ["Amalfi Coast", "Bruges", "Santorini"],
    rarity: "Common",
    packingStyle: "Capsule wardrobe. Linen. Sunglasses that cost more than the flight.",
    travelRedFlag: "Won't eat somewhere without checking reviews first.",
  },
  PRDI: {
    code: "PRDI",
    name: "The Apprentice",
    tagline: "Slow and strange. Just how you like it.",
    description:
      "You plan space for slow, meaningful engagement with unfamiliar worlds. You're drawn to what's different — but you want time to sit with it, not rush through it.",
    portrait:
      "You spent three days in a village learning to make bread from a grandmother who doesn't speak your language. You planned it, but loosely — the kind of plan that has room for a detour into a forest or a four-hour conversation with a stranger.",
    compatibility: ["PBDI", "FRDI", "PRCI"],
    idealDestinations: ["Rural Japan", "Kerala", "Bhutan"],
    rarity: "Rare",
    packingStyle: "Half-empty bag. You'll pick things up along the way.",
    travelRedFlag: "Disappears for a full day and comes back with a new skill.",
  },
  PRDO: {
    code: "PRDO",
    name: "The Pilgrim",
    tagline: "The journey is the point.",
    description:
      "You set out with purpose but let the journey unfold at its own pace. You're comfortable in unfamiliar places and prefer to watch the world move around you.",
    portrait:
      "You planned the route but not the stops. You'll walk for hours through neighborhoods most tourists skip, sit in a park, and write in your journal. You don't need to participate — being present is enough.",
    compatibility: ["PBDO", "FRDO", "PRCO"],
    idealDestinations: ["Camino de Santiago", "Mongolia", "Patagonia"],
    rarity: "Rare",
    packingStyle: "Worn-in boots. One bag. Nothing you'd be sad to lose.",
    travelRedFlag: "Walks 15 miles 'by accident' and acts like it's normal.",
  },
  FBCI: {
    code: "FBCI",
    name: "The Spark",
    tagline: "Say yes first. Figure it out later.",
    description:
      "You follow impulses into a whirlwind of comfortable, immersive experiences. No plan survives contact with your enthusiasm — and that's the point.",
    portrait:
      "You walked into a random bar, made friends with the entire staff, got invited to a birthday party, and somehow ended up at karaoke at 2am. Tomorrow? No idea. But it'll be just as good. You run on energy and charm.",
    compatibility: ["PBCI", "FRCI", "FBDI"],
    idealDestinations: ["Buenos Aires", "Bangkok", "Lisbon"],
    rarity: "Common",
    packingStyle: "Overpacked. 'What if there's a themed party?'",
    travelRedFlag: "Says 'one more place' four times in a row.",
  },
  FBCO: {
    code: "FBCO",
    name: "The Flaneur",
    tagline: "Wander often. Commit to nothing.",
    description:
      "You wander freely through busy streets, watching the world go by. You love the energy of a full day — but you'd rather observe it than join it.",
    portrait:
      "You spent the whole day walking with no destination. You found three great coffee shops, watched a street performance for forty minutes, and took photos of doors. You didn't talk to anyone and that was perfect. The city was the show.",
    compatibility: ["PBCO", "FRCO", "FBDO"],
    idealDestinations: ["Istanbul", "Melbourne", "Marrakech"],
    rarity: "Common",
    packingStyle: "Good shoes. A tote bag. That's it.",
    travelRedFlag: "Refuses to commit to dinner plans until the last possible second.",
  },
  FBDI: {
    code: "FBDI",
    name: "The Adventurer",
    tagline: "No map. No plan. No problem.",
    description:
      "You chase spontaneous thrills and throw yourself into the unknown. You live for the moments that make a good story — the weirder, the better.",
    portrait:
      "You got on the wrong bus on purpose just to see where it goes. You ate something you couldn't identify. You jumped off a cliff into water you couldn't see the bottom of. And you'd do it all again tomorrow. Fear is just excitement with bad branding.",
    compatibility: ["PBDI", "FBCI", "FRDI"],
    idealDestinations: ["Bolivia", "Vietnam", "Georgia (country)"],
    rarity: "Uncommon",
    packingStyle: "Whatever fits in a daypack. Probably forgot sunscreen.",
    travelRedFlag: "Their 'shortcut' adds three hours and a river crossing.",
  },
  FBDO: {
    code: "FBDO",
    name: "The Drifter",
    tagline: "Nowhere to be. Nothing to prove.",
    description:
      "You go wherever the wind takes you, comfortable with discomfort and distance. You don't need a plan or a crowd — just open road and open time.",
    portrait:
      "You've been traveling for three weeks and you still don't know where you're going next. You slept on a train, ate at a truck stop, and spent a whole afternoon watching fishing boats. You're not lost. You just don't believe in destinations.",
    compatibility: ["PBDO", "FBCO", "FRDO"],
    idealDestinations: ["Trans-Siberian Railway", "Morocco", "Laos"],
    rarity: "Rare",
    packingStyle: "Everything you own fits in one bag. By choice.",
    travelRedFlag: "Sends a location pin instead of an address. No context.",
  },
  FRCI: {
    code: "FRCI",
    name: "The Romantic",
    tagline: "Let the city find you.",
    description:
      "You let serendipity guide you to cozy, intimate cultural moments. You want to feel at home in a new place — to stumble into the kind of magic you can't plan.",
    portrait:
      "You wandered into a tiny bookshop, talked to the owner for an hour, and left with a hand-drawn map of their favorite places. You had dinner at the place with the checkered tablecloths and the grandmother cooking in the back. Nothing was planned. Everything was perfect.",
    compatibility: ["PRCI", "FBCI", "FRDI"],
    idealDestinations: ["Porto", "Chiang Mai", "Prague"],
    rarity: "Common",
    packingStyle: "Cozy layers. Journal. Scented candle (yes, really).",
    travelRedFlag: "Tries to befriend every stray cat in the neighborhood.",
  },
  FRCO: {
    code: "FRCO",
    name: "The Dreamer",
    tagline: "Floating through beauty, one moment at a time.",
    description:
      "You float through destinations at your own pace, savoring beauty from afar. You don't need to do much — just being somewhere beautiful is enough.",
    portrait:
      "You spent the morning on a balcony watching the light change over the rooftops. You walked to a garden, sat on a bench, and read for two hours. You had gelato. You watched the sunset. That was the whole day, and it was everything.",
    compatibility: ["PRCO", "FBCO", "FRCI"],
    idealDestinations: ["Lake Como", "Hallstatt", "Udaipur"],
    rarity: "Common",
    packingStyle: "Flowy fabrics. A hat. Main character energy.",
    travelRedFlag: "Accidentally spends an entire vacation doing nothing. No regrets.",
  },
  FRDI: {
    code: "FRDI",
    name: "The Nomad",
    tagline: "Home is wherever feels right.",
    description:
      "You wander slowly into unfamiliar territory, embracing whatever comes. You're not running from comfort — you just don't need much of it.",
    portrait:
      "You moved hostels three times this week because each one felt like a different world. You learned five words in a language you'll never use again. You sat in a temple for an hour not because you're religious, but because it was quiet. You travel like you live — lightly, openly, slowly.",
    compatibility: ["PRDI", "FBDI", "FRCI"],
    idealDestinations: ["Nepal", "Ethiopia", "Peru"],
    rarity: "Uncommon",
    packingStyle: "Threadbare essentials. Souvenirs are for the mind.",
    travelRedFlag: "Says 'I'll figure it out when I get there' about everything.",
  },
  FRDO: {
    code: "FRDO",
    name: "The Ghost",
    tagline: "Present everywhere. Seen by no one.",
    description:
      "You drift through places unseen, at ease in the margins of the unknown. You don't need comfort, company, or a plan — just space to exist in a new world.",
    portrait:
      "You sat in the back of a tea house for three hours and no one noticed you were a tourist. You walked through a neighborhood at dawn and watched the city wake up. You don't take many photos — you just remember. Traveling, for you, is a kind of disappearing.",
    compatibility: ["PRDO", "FBDO", "FRDI"],
    idealDestinations: ["Tbilisi", "Oman", "Northern Japan"],
    rarity: "Very Rare",
    packingStyle: "Dark colors. Worn-in everything. Invisible by design.",
    travelRedFlag: "You won't hear from them for 72 hours. They're fine.",
  },
};

export function getTypeInfo(typeCode: string): TravelerTypeInfo | undefined {
  return TRAVELER_TYPES[typeCode];
}
