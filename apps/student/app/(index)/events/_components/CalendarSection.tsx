import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarSectionProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  date: Date | undefined;
  setDate: (date: Date) => void;
  events: any[];
  getEventsForDate: (date: Date) => any[];
  setSelectedItem: (item: any) => void;
  toast: any;
}

export function CalendarSection({
  currentMonth,
  setCurrentMonth,
  date,
  setDate,
  events,
  getEventsForDate,
  setSelectedItem,
  toast,
}: CalendarSectionProps) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3 shadow-lg md:p-4 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                ),
              )
            }
            className="rounded p-1 hover:bg-neutral-200 dark:hover:bg-zinc-800"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                ),
              )
            }
            className="rounded p-1 hover:bg-neutral-200 dark:hover:bg-zinc-800"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-neutral-500 dark:text-neutral-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from(
          {
            length: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1,
            ).getDay(),
          },
          (_, i) => (
            <div key={`empty-${i}`} />
          ),
        )}
        {Array.from(
          {
            length: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() + 1,
              0,
            ).getDate(),
          },
          (_, i) => {
            const day = i + 1;
            const currentDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day,
            );
            const eventsOnDay = getEventsForDate(currentDate);
            const hasEvents = eventsOnDay.length > 0;
            const isSelected =
              date?.toDateString() === currentDate.toDateString();
            const isToday =
              currentDate.toDateString() === new Date().toDateString();
            return (
              <div key={day} className="relative">
                <button
                  onClick={() => {
                    setDate(currentDate);
                    if (hasEvents) {
                      const filtered = events.filter(
                        (event) =>
                          new Date(event.date).toDateString() ===
                          currentDate.toDateString(),
                      );
                      filtered.forEach((event) => {
                        toast(event.title, {
                          description: `${event.startTime} - ${event.type === "event" ? "Sự kiện" : "Cuộc thi"}`,
                          action: {
                            label: "Xem chi tiết",
                            onClick: () => setSelectedItem(event),
                          },
                        });
                      });
                    }
                  }}
                  className={`relative flex aspect-square w-full items-center justify-center rounded-full text-sm ${hasEvents ? "bg-orange-100 dark:bg-orange-900/20" : "hover:bg-neutral-100 dark:hover:bg-zinc-800"} ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""} ${isToday ? "font-bold" : ""} `}
                >
                  {day}
                  {hasEvents && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                      {eventsOnDay.length > 1 ? eventsOnDay.length : ""}
                    </span>
                  )}
                </button>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
