"use client";
import { useState } from "react";
import { toast } from "sonner";
// Update imports at the top
import { AnimatePresence, motion } from "motion/react";

import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RssIcon,
  Search,
  Trophy,
} from "lucide-react";
import { CompetitionCard } from "./components/CompetitionCard";
import { EventCard } from "./components/EventCard";
import { EventModal } from "./components/EventModal";

// Remove the interfaces and update imports at the top
import { Competition, Event, UserEvents } from "./types";

// Example Data (updated dates to be relevant for May 15, 2025)
const eventsData: (Event | Competition)[] = [
  {
    id: "1",
    type: "event",
    title:
      "Harvard Business School Faculty Talk: Prof. Hise Gibson | Harvard Club of Vietnam",
    startTime: "19:00",
    endTime: "21:00",
    date: new Date(2025, 4, 16), // May 16, 2025
    location: {
      address: "Quận 3, Hồ Chí Minh",
      city: "Ho Chi Minh City",
      coordinates: { lat: 10.7769, lng: 106.7009 },
    },
    organizer: {
      id: "org1",
      name: "Stephen & Nguyen",
      avatar:
        "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    },
    participants: {
      count: 24,
      registered: Array(24).fill({
        id: "user1",
        avatar:
          "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
      }),
    },
    category: "Education",
    status: "upcoming",
    imageUrl:
      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    description: "Join us for an insightful talk...",
    capacity: 50,
  },
  {
    id: "2",
    type: "competition",
    title: "Hackathon Fintech 2025",
    startTime: "08:00",
    endTime: "17:00",
    date: new Date(2025, 4, 20), // May 20, 2025
    deadline: new Date(2025, 4, 15), // May 15, 2025
    location: {
      address: "Quận 7, Hồ Chí Minh",
      city: "Ho Chi Minh City",
      coordinates: { lat: 10.7288, lng: 106.7182 },
    },
    organizer: {
      id: "org2",
      name: "Tech Community",
      avatar:
        "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    },
    participants: {
      count: 120,
      registered: Array(120).fill({
        id: "user1",
        avatar:
          "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
      }),
    },
    status: "upcoming",
    imageUrl: "/images/hackathon.jpg",
    description: "Build the future of finance...",
    capacity: 200,
    prize: "100,000,000 VND",
    requirements: [
      "Sinh viên năm 3-4",
      "Có kiến thức về lập trình",
      "Làm việc nhóm tốt",
    ],
  },
  {
    id: "3",
    type: "competition",
    title: "AI Challenge 2025",
    startTime: "09:00",
    endTime: "18:00",
    date: new Date(2025, 4, 15), // May 15, 2025 (today)
    deadline: new Date(2025, 4, 10), // May 10, 2025
    location: {
      address: "Quận 1, Hồ Chí Minh",
      city: "Ho Chi Minh City",
    },
    organizer: {
      id: "org3",
      name: "AI Vietnam",
      avatar:
        "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    },
    participants: {
      count: 80,
      registered: Array(80).fill({
        id: "user1",
        avatar:
          "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
      }),
    },
    status: "ongoing",
    imageUrl:
      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    description: "Solve real-world problems with AI...",
    capacity: 100,
    prize: "50,000,000 VND",
    requirements: ["Kiến thức về ML/AI", "Python programming", "Data analysis"],
  },
  {
    id: "4",
    type: "event",
    title: "Workshop: Blockchain Development",
    startTime: "14:00",
    endTime: "17:00",
    date: new Date(2025, 4, 15), // May 15, 2025 (today)
    location: {
      address: "Quận 1, Hồ Chí Minh",
      city: "Ho Chi Minh City",
      coordinates: { lat: 10.7756, lng: 106.7019 },
    },
    organizer: {
      id: "org4",
      name: "Blockchain Vietnam",
      avatar: "/avatars/blockchain.jpg",
    },
    participants: {
      count: 45,
      registered: Array(45).fill({
        id: "user1",
        avatar: "/avatars/default.jpg",
      }),
    },
    category: "Technology",
    status: "ongoing",
    imageUrl:
      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    description: "Learn about blockchain development and Web3 technologies",
    capacity: 50,
  },
  {
    id: "5",
    type: "event",
    title: "UX/UI Design Meetup",
    startTime: "18:30",
    endTime: "20:30",
    date: new Date(2025, 4, 17), // May 17, 2025
    location: {
      address: "Quận 2, Hồ Chí Minh",
      city: "Ho Chi Minh City",
      coordinates: { lat: 10.7868, lng: 106.7468 },
    },
    organizer: {
      id: "org5",
      name: "Design Community",
      avatar: "/avatars/design.jpg",
    },
    participants: {
      count: 30,
      registered: Array(30).fill({
        id: "user1",
        avatar: "/avatars/default.jpg",
      }),
    },
    category: "Design",
    status: "upcoming",
    imageUrl:
      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    description: "Monthly meetup for UX/UI designers to share experiences",
    capacity: 40,
  },
  {
    id: "6",
    type: "event",
    title: "Startup Networking Night",
    startTime: "19:00",
    endTime: "22:00",
    date: new Date(2025, 4, 20), // May 20, 2025
    location: {
      address: "Quận 4, Hồ Chí Minh",
      city: "Ho Chi Minh City",
      coordinates: { lat: 10.7578, lng: 106.7042 },
    },
    organizer: {
      id: "org6",
      name: "Startup Vietnam",
      avatar:
        "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    },
    participants: {
      count: 65,
      registered: Array(65).fill({
        id: "user1",
        avatar:
          "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
      }),
    },
    category: "Networking",
    status: "upcoming",
    imageUrl:
      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400",
    description: "Connect with fellow entrepreneurs and investors",
    capacity: 100,
  },
];

export default function Events() {
  const [selectedItem, setSelectedItem] = useState<Event | Competition | null>(
    null,
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [userEvents, setUserEvents] = useState<UserEvents>({
    registered: eventsData
      .filter((event) => event.status === "upcoming")
      .slice(0, 2),
    attended: eventsData
      .filter((event) => event.status === "completed")
      .slice(0, 2),
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"events" | "competitions">(
    "events",
  );

  const filteredEvents = eventsData.filter((item) => {
    if (activeTab === "events") {
      return item.type === "event";
    } else {
      return item.type === "competition";
    }
  });

  const todayEvents = filteredEvents.filter(
    (e) => e.date.toDateString() === new Date().toDateString(),
  );

  const upcomingEvents = filteredEvents.filter(
    (e) => e.date > new Date() && e.status === "upcoming",
  );

  const ongoingCompetitions = filteredEvents.filter(
    (e) => e.type === "competition" && e.status === "ongoing",
  );

  const upcomingCompetitions = filteredEvents.filter(
    (e) => e.type === "competition" && e.status === "upcoming",
  );

  const handleRegister = () => {
    if (!selectedItem) return;

    // Check if already registered
    const isAlreadyRegistered = userEvents.registered.some(
      (event) => event.id === selectedItem.id,
    );

    if (isAlreadyRegistered) {
      toast.error("Bạn đã đăng ký sự kiện này!");
      return;
    }

    // Check capacity
    if (selectedItem.participants.count >= selectedItem.capacity!) {
      toast.error("Sự kiện đã đạt số lượng người tham gia tối đa!");
      return;
    }

    setUserEvents((prev) => ({
      ...prev,
      registered: [...prev.registered, selectedItem],
    }));

    // Update the participants count in eventsData
    const updatedEventsData = eventsData.map((event) =>
      event.id === selectedItem.id
        ? {
            ...event,
            participants: {
              ...event.participants,
              count: event.participants.count + 1,
            },
          }
        : event,
    );

    // Update the filtered events
    const updatedEvent = updatedEventsData.find(
      (event) => event.id === selectedItem.id,
    );
    setSelectedItem(updatedEvent || null);

    toast.success("Đăng ký thành công!", {
      description: `Bạn đã đăng ký tham gia "${selectedItem.title}"`,
    });
  };
  const getEventsForDate = (date: Date) => {
    return eventsData.filter(
      (event) => event.date.toDateString() === date.toDateString(),
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="container mx-auto flex flex-col gap-6 p-6 md:flex-row">
        {/* Main Content */}
        <div className="max-h-[calc(100vh-2rem)] w-full overflow-auto md:w-3/4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("events")}
                className={`border-b-2 pb-2 text-2xl font-bold ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                Sự kiện
              </button>
              <button
                onClick={() => setActiveTab("competitions")}
                className={`border-b-2 pb-2 text-2xl font-bold ${
                  activeTab === "competitions"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                Cuộc thi
              </button>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm shadow-sm hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <Plus size={18} />
                {activeTab === "events" ? "Gửi sự kiện" : "Tạo cuộc thi"}
              </button>
              <button className="rounded-full bg-gray-100 p-2 shadow-sm hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <RssIcon size={18} />
              </button>
              <button className="rounded-full bg-gray-100 p-2 shadow-sm hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Timeline Events with scroll */}
          <div className="space-y-6 pr-4">
            {activeTab === "events" ? (
              <>
                {/* Today's Events */}
                <div className="relative">
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow-sm dark:bg-zinc-800">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                    </div>
                    <h2 className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      Hôm nay •{" "}
                      {new Date().toLocaleDateString("vi-VN", {
                        weekday: "long",
                      })}
                    </h2>
                    {todayEvents.length > 0 ? (
                      todayEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event as Event}
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
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow-sm dark:bg-zinc-800">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                    </div>
                    <h2 className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      Sắp diễn ra
                    </h2>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event as Event}
                          onClick={() => setSelectedItem(event)}
                        />
                      ))
                    ) : (
                      <EventCard isEmpty />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Ongoing Competitions */}
                <div className="relative">
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow-sm dark:bg-zinc-800">
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                    <h2 className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      Cuộc thi đang diễn ra
                    </h2>
                    {ongoingCompetitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition as Competition}
                        onClick={() => setSelectedItem(competition)}
                      />
                    ))}
                  </div>
                </div>

                {/* Upcoming Competitions */}
                <div className="relative">
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gray-200 dark:bg-zinc-800"></div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow-sm dark:bg-zinc-800">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <h2 className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      Cuộc thi sắp tới
                    </h2>
                    {upcomingCompetitions.length > 0 ? (
                      upcomingCompetitions.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition as Competition}
                          onClick={() => setSelectedItem(competition)}
                        />
                      ))
                    ) : (
                      <div className="mb-4 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <div className="ITEMS-center flex flex-col justify-center gap-3 text-center">
                          <Trophy
                            size={40}
                            className="text-gray-400 dark:text-gray-600"
                          />
                          <p className="text-gray-500 dark:text-gray-400">
                            Không có cuộc thi nào sắp diễn ra
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-6 w-full space-y-6 md:mt-0 md:w-1/4">
          <div className="sticky top-6 space-y-6">
            {/* Calendar Section */}
            <div className="rounded-xl bg-gray-50 p-4 shadow-lg dark:bg-zinc-900">
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
                    className="rounded p-1 hover:bg-gray-200 dark:hover:bg-zinc-800"
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
                    className="rounded p-1 hover:bg-gray-200 dark:hover:bg-zinc-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ),
                )}
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
                              const filtered = eventsData.filter(
                                (event) =>
                                  event.date.toDateString() ===
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
                          className={`relative flex aspect-square w-full items-center justify-center rounded-full text-sm ${hasEvents ? "bg-orange-100 dark:bg-orange-900/20" : "hover:bg-gray-100 dark:hover:bg-zinc-800"} ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""} ${isToday ? "font-bold" : ""} `}
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

            {/* Registered Events */}
            <div className="rounded-xl bg-gray-50 p-4 shadow-lg dark:bg-zinc-900">
              <h2 className="mb-4 text-xl font-bold">Your Events</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Registered
                  </h3>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {userEvents.registered.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-zinc-800"
                      >
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-8 w-8 rounded"
                        />
                        <div className="flex-1 truncate">
                          <p className="truncate text-sm font-medium">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {event.startTime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Attended
                  </h3>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {userEvents.attended.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-zinc-800"
                      >
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-8 w-8 rounded"
                        />
                        <div className="flex-1 truncate">
                          <p className="truncate text-sm font-medium">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {event.startTime}
                          </p>
                        </div>
                        <CheckCircle size={16} className="text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/40"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50"
            >
              <EventModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onRegister={handleRegister}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
