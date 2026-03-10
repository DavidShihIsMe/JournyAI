"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { swipeCards } from "@/lib/onboarding/cards";
import SwipeCard from "./SwipeCard";

type SwipeResponse = "left" | "right" | "super_like";

export interface CardResponse {
  cardId: number;
  response: SwipeResponse;
}

interface SwipeCardStackProps {
  onComplete: (responses: CardResponse[]) => void;
}

export default function SwipeCardStack({ onComplete }: SwipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<CardResponse[]>([]);

  const handleSwipe = useCallback(
    (response: SwipeResponse) => {
      const card = swipeCards[currentIndex];
      const newResponses = [...responses, { cardId: card.id, response }];
      setResponses(newResponses);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= swipeCards.length) {
        onComplete(newResponses);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, responses, onComplete]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Progress indicator */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {swipeCards.length}
        </span>
        <div className="flex gap-1">
          {swipeCards.map((_, i) => (
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

      {/* Card stack */}
      <div className="relative flex-1 px-4 pb-4">
        <AnimatePresence>
          {swipeCards.map((card, i) => {
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
