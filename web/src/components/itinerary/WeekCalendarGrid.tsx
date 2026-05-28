"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import {
  formatAdjustedClockTime,
  displayTimeOffsetMinutes,
} from "@/lib/itineraryScheduleDisplay";
import type { GeneratedItinerary } from "@/lib/tripTypes";
import {
  blockHeightPx,
  calendarGridHeightPx,
  CALENDAR_COLUMN_MIN_WIDTH,
  CALENDAR_TIME_AXIS_WIDTH,
  type CalendarBlockModel,
  type CalendarDayColumn,
  hourTicks,
  minutesToTopPx,
  topPxToMinutes,
  formatHourLabel,
} from "@/lib/weekCalendarLayout";

type DragState = {
  slotKey: string;
  dayIndex: number;
  durationMinutes: number;
  kind: "activity" | "travel";
  label: string;
  pointerOffsetY: number;
};

type Props = {
  columns: CalendarDayColumn[];
  itinerary: GeneratedItinerary;
  venueSelections: Record<string, string>;
  travelOverrides: Record<string, number>;
  onBlockClick: (dayIndex: number, rowIndex: number) => void;
  onBlockMove: (slotKey: string, newStartMinutes: number) => void;
};

function CalendarLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-4 px-4 py-3"
      style={{ borderBottom: `1px solid ${INK3}`, background: PAPER2 }}
    >
      <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: INK3 }}>
        <span
          className="inline-block w-4 h-3 align-middle mr-1"
          style={{ border: `1px solid ${INK}`, background: PAPER }}
        />{" "}
        Activity
      </span>
      <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: INK3 }}>
        <span
          className="inline-block w-4 h-3 align-middle mr-1"
          style={{ border: `1px dashed ${INK3}`, background: PAPER2 }}
        />{" "}
        Travel
      </span>
      <span style={{ fontFamily: SERIF, fontSize: 13, color: INK2 }}>
        Drag to reschedule · tap to edit venue or transport
      </span>
    </div>
  );
}

export default function WeekCalendarGrid({
  columns,
  itinerary,
  venueSelections,
  travelOverrides,
  onBlockClick,
  onBlockMove,
}: Props) {
  const timeGridBodyRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragMovedRef = useRef(false);
  const dragStartClientYRef = useRef(0);
  const onBlockMoveRef = useRef(onBlockMove);
  onBlockMoveRef.current = onBlockMove;

  const [drag, setDrag] = useState<DragState | null>(null);
  const [ghostTop, setGhostTop] = useState(0);
  const [ghostLeft, setGhostLeft] = useState(0);
  const [ghostWidth, setGhostWidth] = useState(CALENDAR_COLUMN_MIN_WIDTH);
  const gridHeight = calendarGridHeightPx();

  const updateGhostFromPointer = useCallback(
    (clientX: number, clientY: number, state: DragState) => {
      const body = timeGridBodyRef.current;
      if (!body) return;
      const rect = body.getBoundingClientRect();
      const yInGrid = clientY - rect.top;
      const colWidth = Math.max(
        CALENDAR_COLUMN_MIN_WIDTH,
        (rect.width - CALENDAR_TIME_AXIS_WIDTH) / Math.max(1, columns.length)
      );
      const top = Math.min(
        gridHeight - blockHeightPx(state.durationMinutes),
        Math.max(0, yInGrid - state.pointerOffsetY)
      );
      const colLeft = CALENDAR_TIME_AXIS_WIDTH + state.dayIndex * colWidth;
      setGhostTop(top);
      setGhostLeft(colLeft + 4);
      setGhostWidth(colWidth - 8);
    },
    [columns.length, gridHeight]
  );

  useEffect(() => {
    if (!drag) return;

    const onWindowPointerMove = (e: PointerEvent) => {
      const state = dragRef.current;
      if (!state) return;
      if (Math.abs(e.clientY - dragStartClientYRef.current) > 4) {
        dragMovedRef.current = true;
      }
      updateGhostFromPointer(e.clientX, e.clientY, state);
    };

    const onWindowPointerUp = (e: PointerEvent) => {
      const state = dragRef.current;
      if (!state) return;
      const body = timeGridBodyRef.current;
      if (body && dragMovedRef.current) {
        const rect = body.getBoundingClientRect();
        const yInGrid = e.clientY - rect.top - state.pointerOffsetY;
        const newStart = topPxToMinutes(yInGrid);
        onBlockMoveRef.current(state.slotKey, newStart);
      }
      dragRef.current = null;
      setDrag(null);
    };

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
  }, [drag, updateGhostFromPointer]);

  function startDrag(
    e: React.PointerEvent,
    block: CalendarBlockModel,
    colIndex: number
  ) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    const blockRect = target.getBoundingClientRect();
    const body = timeGridBodyRef.current;
    if (!body) return;
    const bodyRect = body.getBoundingClientRect();
    const pointerOffsetY = e.clientY - blockRect.top;

    const state: DragState = {
      slotKey: block.slotKey,
      dayIndex: colIndex,
      durationMinutes: block.durationMinutes,
      kind: block.kind,
      label: block.label,
      pointerOffsetY,
    };

    dragMovedRef.current = false;
    dragStartClientYRef.current = e.clientY;
    dragRef.current = state;
    setDrag(state);
    setGhostTop(blockRect.top - bodyRect.top);
    const colWidth = Math.max(
      CALENDAR_COLUMN_MIN_WIDTH,
      (bodyRect.width - CALENDAR_TIME_AXIS_WIDTH) / Math.max(1, columns.length)
    );
    setGhostLeft(CALENDAR_TIME_AXIS_WIDTH + colIndex * colWidth + 4);
    setGhostWidth(colWidth - 8);
    target.setPointerCapture(e.pointerId);
  }

  function handleBlockClick(colIndex: number, rowIndex: number) {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }
    onBlockClick(colIndex, rowIndex);
  }

  return (
    <div className="overflow-x-auto border" style={{ borderColor: INK3, background: PAPER }}>
      <CalendarLegend />

      <div
        className="grid min-w-[720px]"
        style={{
          gridTemplateColumns: `${CALENDAR_TIME_AXIS_WIDTH}px repeat(${columns.length}, minmax(${CALENDAR_COLUMN_MIN_WIDTH}px, 1fr))`,
        }}
      >
        <div style={{ borderBottom: `1px solid ${INK3}`, background: PAPER2 }} />
        {columns.map((col) => (
          <div
            key={col.dayNum}
            className="px-2 py-3 text-center"
            style={{ borderBottom: `1px solid ${INK3}`, borderLeft: `1px solid ${INK3}`, background: PAPER2 }}
          >
            <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: INK3 }}>
              {col.weekdayLabel}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: INK }}>{col.dateLabel}</div>
            <div style={{ fontFamily: SERIF, fontSize: 12, color: INK2, marginTop: 2 }}>{col.title}</div>
          </div>
        ))}
      </div>

      <div
        ref={timeGridBodyRef}
        className="relative grid min-w-[720px]"
        style={{
          gridTemplateColumns: `${CALENDAR_TIME_AXIS_WIDTH}px repeat(${columns.length}, minmax(${CALENDAR_COLUMN_MIN_WIDTH}px, 1fr))`,
          height: gridHeight,
        }}
      >
        <div className="relative" style={{ height: gridHeight, borderRight: `1px solid ${INK3}` }}>
          {hourTicks().map((m) => (
            <div
              key={m}
              className="absolute right-2 -translate-y-1/2"
              style={{
                top: minutesToTopPx(m),
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.1em",
                color: INK3,
              }}
            >
              {formatHourLabel(m)}
            </div>
          ))}
        </div>

        {columns.map((col, colIndex) => {
          const day = itinerary.days[colIndex];
          return (
            <div
              key={col.dayNum}
              className="relative"
              style={{ height: gridHeight, borderLeft: `1px solid ${INK3}` }}
            >
              {hourTicks().map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: minutesToTopPx(m),
                    borderTop: `1px solid ${INK3}33`,
                  }}
                />
              ))}
              {col.blocks.map((block) => {
                const row = day?.items[block.rowIndex];
                if (!row) return null;
                const timeLabel = formatAdjustedClockTime(
                  row.time,
                  displayTimeOffsetMinutes(day, block.rowIndex, venueSelections, travelOverrides)
                );
                const isDragging = drag?.slotKey === block.slotKey;
                const h = blockHeightPx(block.durationMinutes);
                const top = minutesToTopPx(block.startMinutes);

                return (
                  <div
                    key={block.slotKey}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleBlockClick(colIndex, block.rowIndex);
                      }
                    }}
                    onClick={() => handleBlockClick(colIndex, block.rowIndex)}
                    onPointerDown={(e) => startDrag(e, block, colIndex)}
                    className="absolute left-1 right-1 text-left cursor-grab active:cursor-grabbing overflow-hidden touch-none select-none"
                    style={{
                      top,
                      height: h,
                      opacity: isDragging ? 0.35 : 1,
                      zIndex: isDragging ? 1 : 2,
                      padding: "6px 8px",
                      border:
                        block.kind === "travel"
                          ? `1px dashed ${INK3}`
                          : `1px solid ${INK}`,
                      background: block.kind === "travel" ? `${PAPER2}` : PAPER,
                      boxShadow: block.kind === "activity" ? `0 1px 0 ${INK3}44` : undefined,
                    }}
                    aria-label={
                      block.kind === "travel"
                        ? `Travel ${timeLabel}`
                        : `${block.label} ${timeLabel}`
                    }
                  >
                    {block.kind === "travel" ? null : (
                      <>
                        <div
                          style={{
                            fontFamily: SANS,
                            fontSize: 8,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: INK3,
                          }}
                        >
                          {timeLabel}
                        </div>
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: 12,
                            lineHeight: 1.25,
                            color: INK,
                            marginTop: 2,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {block.label}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {drag ? (
          <div
            className="absolute pointer-events-none overflow-hidden select-none"
            style={{
              top: ghostTop,
              left: ghostLeft,
              width: ghostWidth,
              height: blockHeightPx(drag.durationMinutes),
              zIndex: 50,
              padding: "6px 8px",
              border: drag.kind === "travel" ? `1px dashed ${INK}` : `2px solid ${INK}`,
              background: drag.kind === "travel" ? `${PAPER2}ee` : `${PAPER}ee`,
              boxShadow: "0 8px 24px rgba(27,26,24,0.25)",
            }}
          >
            {drag.kind === "travel" ? null : (
              <div style={{ fontFamily: SERIF, fontSize: 12, color: INK }}>{drag.label}</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
