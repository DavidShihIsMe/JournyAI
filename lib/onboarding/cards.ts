export type SwipeCard = {
  id: number;
  caption: string;
  imageUrl: string;
  tier: "anchor" | "compound" | "full_spectrum";
  weights: {
    plan_flow: number;
    busy_relaxed: number;
    comfort_discomfort: number;
    immerse_observe: number;
  };
};

export const swipeCards: SwipeCard[] = [
  {
    id: 1,
    caption: "No plan. Full day. Six neighborhoods before sunset.",
    imageUrl: "/images/cards/card-1.jpg",
    tier: "compound",
    weights: { plan_flow: 3, busy_relaxed: -3, comfort_discomfort: 0, immerse_observe: 0 },
  },
  {
    id: 2,
    caption: "Booked three weeks ago. Table for two. 7:15pm.",
    imageUrl: "/images/cards/card-2.jpg",
    tier: "anchor",
    weights: { plan_flow: -3, busy_relaxed: 0, comfort_discomfort: 0, immerse_observe: 0 },
  },
  {
    id: 3,
    caption: "No trail markers. No guardrails. No idea what's at the top. Keep climbing.",
    imageUrl: "/images/cards/card-3.jpg",
    tier: "compound",
    weights: { plan_flow: 0, busy_relaxed: 0, comfort_discomfort: 3, immerse_observe: -3 },
  },
  {
    id: 4,
    caption: "9am cooking class. 11am art tour. 1pm chef's table. Every hour, something new.",
    imageUrl: "/images/cards/card-4.jpg",
    tier: "full_spectrum",
    weights: { plan_flow: -3, busy_relaxed: -3, comfort_discomfort: -3, immerse_observe: -3 },
  },
  {
    id: 5,
    caption: "One thing today. Maybe two. Maybe just this.",
    imageUrl: "/images/cards/card-5.jpg",
    tier: "anchor",
    weights: { plan_flow: 0, busy_relaxed: 3, comfort_discomfort: 0, immerse_observe: 0 },
  },
  {
    id: 6,
    caption: "Six-month waitlist. They already know your wine preferences.",
    imageUrl: "/images/cards/card-6.jpg",
    tier: "compound",
    weights: { plan_flow: -3, busy_relaxed: 0, comfort_discomfort: -3, immerse_observe: 0 },
  },
  {
    id: 7,
    caption: "Cooking class, pickup soccer, pottery studio, street dancing. And that was just Tuesday.",
    imageUrl: "/images/cards/card-7.jpg",
    tier: "compound",
    weights: { plan_flow: 0, busy_relaxed: -3, comfort_discomfort: 0, immerse_observe: -3 },
  },
  {
    id: 8,
    caption: "Can't read the signs. Don't speak the language. Never felt more alive.",
    imageUrl: "/images/cards/card-8.jpg",
    tier: "anchor",
    weights: { plan_flow: 0, busy_relaxed: 0, comfort_discomfort: 3, immerse_observe: 0 },
  },
  {
    id: 9,
    caption: "Room service. Golden hour. The whole city below.",
    imageUrl: "/images/cards/card-9.jpg",
    tier: "compound",
    weights: { plan_flow: 0, busy_relaxed: 0, comfort_discomfort: -3, immerse_observe: 3 },
  },
  {
    id: 10,
    caption: "Got off at the wrong stop. Stayed two hours. Forgot to leave.",
    imageUrl: "/images/cards/card-10.jpg",
    tier: "full_spectrum",
    weights: { plan_flow: 3, busy_relaxed: 3, comfort_discomfort: 3, immerse_observe: 3 },
  },
  {
    id: 11,
    caption: "Sat there all afternoon. Didn't need to be anywhere else.",
    imageUrl: "/images/cards/card-11.jpg",
    tier: "anchor",
    weights: { plan_flow: 0, busy_relaxed: 0, comfort_discomfort: 0, immerse_observe: 3 },
  },
  {
    id: 12,
    caption: "Someone said there's a festival. Hitched a ride. Midnight now. No idea how to get back.",
    imageUrl: "/images/cards/card-12.jpg",
    tier: "full_spectrum",
    weights: { plan_flow: 3, busy_relaxed: -3, comfort_discomfort: 3, immerse_observe: -3 },
  },
];
