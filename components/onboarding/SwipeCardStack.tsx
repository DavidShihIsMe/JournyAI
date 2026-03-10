"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { SwipeCard as SwipeCardType, SwipeResponse, CardResponse } from "@/lib/onboarding/types";
import SwipeCard from "./SwipeCard";

interface SwipeCardStackProps {
  cards: SwipeCardType[];
  onComplete: (responses: CardResponse[]) => void;
}

export default function SwipeCardStack({ cards, onComplete }: SwipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<CardResponse[]>([]);

  const handleSwipe = useCallback(
    (response: SwipeResponse) => {
      const card = cards[currentIndex];
      const newResponses = [...responses, { cardId: card.id, response }];
      setResponses(newResponses);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= cards.length) {
        onComplete(newResponses);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, responses, cards, onComplete]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-primary"
                  : i === currentIndex
                    ? "bg-primary/60"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1 px-4 pb-4">
        <AnimatePresence>
          {cards.map((card, i) => {
            if (i < currentIndex || i > currentIndex + 1) return null;
            return (
              <SwipeCard
                key={card.id}
                card={card}
                onSwipe={handleSwipe}
                active={i === currentIndex}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
