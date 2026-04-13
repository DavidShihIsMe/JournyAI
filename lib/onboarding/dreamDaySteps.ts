export type DimensionKey = "plan_flow" | "busy_relaxed" | "comfort_adventure" | "immerse_observe";

export interface DreamDayChoice {
  text: string;
  score: number;
}

export interface DreamDayStep {
  dimension: DimensionKey;
  question: string;
  choices: DreamDayChoice[];
}

export const fixedSteps: DreamDayStep[] = [
  {
    dimension: "plan_flow",
    question: "You're going on a trip next month. How do you prepare?",
    choices: [
      { text: "Spreadsheet. Restaurants saved. Tickets pre-booked.", score: -5 },
      { text: "I'll do some research but leave room for surprises.", score: -2 },
      { text: "I'll figure it out the week before.", score: +2 },
      { text: "I booked the flight. That's enough planning.", score: +5 },
    ],
  },
  {
    dimension: "busy_relaxed",
    question: "You have a full day in a new city. What does it look like?",
    choices: [
      { text: "Up at 7. Six stops. Eat on the go. Collapse at midnight.", score: -5 },
      { text: "Three or four things planned. Gaps in between.", score: -2 },
      { text: "One or two things. The rest is open.", score: +2 },
      { text: "No agenda. Maybe I leave the hotel, maybe I don't.", score: +5 },
    ],
  },
  {
    dimension: "comfort_adventure",
    question: "Where are you sleeping tonight?",
    choices: [
      { text: "A hotel with great reviews and clean sheets.", score: -5 },
      { text: "An Airbnb in a nice neighborhood.", score: -2 },
      { text: "A hostel. Cheap and social.", score: +2 },
      { text: "Wherever I end up. I've slept on a bus before.", score: +5 },
    ],
  },
  {
    dimension: "immerse_observe",
    question: "You walk past a street market. What do you do?",
    choices: [
      { text: "Talk to every vendor. Try everything. Buy too much.", score: -5 },
      { text: "Sign up for the workshop happening in the corner.", score: -2 },
      { text: "Grab a coffee nearby and people-watch for an hour.", score: +2 },
      { text: "Walk through slowly. Take it in. Don't touch anything.", score: +5 },
    ],
  },
];

// Each dimension has two dynamic versions: index 0 for step 5, index 1 for step 6
export const dynamicSteps: Record<DimensionKey, [DreamDayStep, DreamDayStep]> = {
  plan_flow: [
    {
      dimension: "plan_flow",
      question: "Your friend bails on dinner plans. What do you do?",
      choices: [
        { text: "Pull up the backup restaurant I already saved.", score: -5 },
        { text: "Google something nearby with good reviews.", score: -2 },
        { text: "Walk around until something catches my eye.", score: +2 },
        { text: "Ask a stranger where they'd eat tonight.", score: +5 },
      ],
    },
    {
      dimension: "plan_flow",
      question: "You hear about an amazing waterfall two hours away.",
      choices: [
        { text: "Already knew about it. It's on tomorrow's itinerary.", score: -5 },
        { text: "Look up how to get there and book a ride.", score: -2 },
        { text: "Find someone who's going and hitch a ride.", score: +2 },
        { text: "If it happens, it happens.", score: +5 },
      ],
    },
  ],
  busy_relaxed: [
    {
      dimension: "busy_relaxed",
      question: "It's your last night. You leave tomorrow morning.",
      choices: [
        { text: "There's still three things on my list. Sleep on the plane.", score: -5 },
        { text: "One nice dinner. Maybe a bar after.", score: -2 },
        { text: "Find a good spot and just sit for a while.", score: +2 },
        { text: "I'm already packing. Early night.", score: +5 },
      ],
    },
    {
      dimension: "busy_relaxed",
      question: "You wake up with no plans. What happens?",
      choices: [
        { text: "Make a plan immediately. The day isn't going to fill itself.", score: -5 },
        { text: "Head out and see what I find. Stay busy.", score: -2 },
        { text: "Coffee first. Then maybe one thing.", score: +2 },
        { text: "Stay in. Read. Maybe go out later. Maybe not.", score: +5 },
      ],
    },
  ],
  comfort_adventure: [
    {
      dimension: "comfort_adventure",
      question: "You're hungry and there are two options across the street.",
      choices: [
        { text: "The one with 4.8 stars and a waitlist.", score: -5 },
        { text: "The one that looks clean and has an English menu.", score: -2 },
        { text: "The one with no menu where you just point.", score: +2 },
        { text: "The sketchy one down the alley that smells incredible.", score: +5 },
      ],
    },
    {
      dimension: "comfort_adventure",
      question: "How are you getting to the next city?",
      choices: [
        { text: "Pre-booked train. First class if it's cheap enough.", score: -5 },
        { text: "Regular bus. Booked in advance.", score: -2 },
        { text: "The local minivan that's technically full but fits one more.", score: +2 },
        { text: "Hitchhike. Or figure it out at the station.", score: +5 },
      ],
    },
  ],
  immerse_observe: [
    {
      dimension: "immerse_observe",
      question: "There's a local festival happening tonight.",
      choices: [
        { text: "I'm in the crowd. Dancing. No idea what's happening but I'm part of it.", score: -5 },
        { text: "I sign up for whatever they'll let tourists join.", score: -2 },
        { text: "I grab a drink and watch from the side.", score: +2 },
        { text: "I find a rooftop nearby and watch from above.", score: +5 },
      ],
    },
    {
      dimension: "immerse_observe",
      question: "You find a tiny bar with live music.",
      choices: [
        { text: "I'm requesting songs by the second round.", score: -5 },
        { text: "I'm buying the band a drink and hearing their story.", score: -2 },
        { text: "Corner seat. Just listen. This is perfect.", score: +2 },
        { text: "Stand outside for a bit, take it in, keep walking.", score: +5 },
      ],
    },
  ],
};

/**
 * After steps 1-4, find the two dimensions with the weakest signal
 * (lowest absolute score). Returns [weakest, secondWeakest].
 */
export function getWeakestDimensions(
  scores: Record<DimensionKey, number>
): [DimensionKey, DimensionKey] {
  const dims: DimensionKey[] = ["plan_flow", "busy_relaxed", "comfort_adventure", "immerse_observe"];
  const sorted = [...dims].sort((a, b) => Math.abs(scores[a]) - Math.abs(scores[b]));
  return [sorted[0], sorted[1]];
}
