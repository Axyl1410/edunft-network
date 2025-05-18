import { Event } from "../types";
import { EventCard } from "./EventCard";

interface EventListProps {
  todayEvents: Event[];
  upcomingEvents: Event[];
  setSelectedItem: (item: Event) => void;
}

export function EventList({
  todayEvents,
  upcomingEvents,
  setSelectedItem,
}: EventListProps) {
  return (
    <>
      {/* Today's Events */}
      <div className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-neutral-200 dark:bg-zinc-800"></div>
        <div className="relative pl-10">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 shadow-sm dark:bg-zinc-800">
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          </div>
          <h2 className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Hôm nay •{" "}
            {new Date().toLocaleDateString("vi-VN", { weekday: "long" })}
          </h2>
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedItem(event)}
              />
            ))
          ) : (
            <EventCard isEmpty />
          )}
        </div>
      </div>
      {/* Future Events */}
      <div className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-neutral-200 dark:bg-zinc-800"></div>
        <div className="relative pl-10">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 shadow-sm dark:bg-zinc-800">
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          </div>
          <h2 className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Sắp diễn ra
          </h2>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedItem(event)}
              />
            ))
          ) : (
            <EventCard isEmpty />
          )}
        </div>
      </div>
    </>
  );
}
