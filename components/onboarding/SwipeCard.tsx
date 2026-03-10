"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { SwipeCard as SwipeCardType, SwipeResponse } from "@/lib/onboarding/types";

interface SwipeCardProps {
  card: SwipeCardType;
  onSwipe: (response: SwipeResponse) => void;
  active: boolean;
}

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({ card, onSwipe, active }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const greenOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 0.5]);
  const redOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [0.5, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: active ? 10 : 0 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-300">
        <div
          className="absolute inset-0 bg-neutral-400"
          style={{
            backgroundImage: `url(${card.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-green-500"
          style={{ opacity: greenOpacity }}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-red-500"
          style={{ opacity: redOpacity }}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-24 pt-20">
          <p className="text-lg font-medium leading-snug text-white">
            {card.caption}
          </p>
        </div>

        {active && (
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <button
              type="button"
              onClick={() => onSwipe("super_like")}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-yellow-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
