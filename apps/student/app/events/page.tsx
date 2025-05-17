"use client";
import { baseUrl } from "@/lib/client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RssIcon,
  Search,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { CompetitionCard } from "./components/CompetitionCard";
import { EventCard } from "./components/EventCard";
import { EventModal } from "./components/EventModal";
import { Competition, Event, UserEvents } from "./types";

export default function Events() {
  const account = useActiveAccount();
  const walletAddress = account?.address;

  const [selectedItem, setSelectedItem] = useState<Event | Competition | null>(
    null,
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<(Event | Competition)[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvents>({
    registered: [],
    attended: [],
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"events" | "competitions">(
    "events",
  );
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    imageUrl: "",
    category: "",
    prize: "",
    requirements: "",
    deadline: "",
    type: "event",
  });
  const [step, setStep] = useState(0);

  // State for dialogs and forms
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openCompetitionDialog, setOpenCompetitionDialog] = useState(false);
  const [formDataEvent, setFormDataEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    imageUrl: "",
    category: "",
    type: "event",
  });
  const [formDataCompetition, setFormDataCompetition] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    imageUrl: "",
    category: "",
    prize: "",
    requirements: "",
    deadline: "",
    type: "competition",
  });
  const [stepEvent, setStepEvent] = useState(0);
  const [stepCompetition, setStepCompetition] = useState(0);

  // Fetch all events/competitions
  useEffect(() => {
    setLoading(true);
    const url =
      activeTab === "competitions"
        ? baseUrl + "/events/competition"
        : baseUrl + "/events";
    axios
      .get(url)
      .then((res) => {
        const mapped = res.data.map((item: any) => ({
          ...item,
          id: item._id || item.id,
          date: item.date ? new Date(item.date) : undefined,
          deadline: item.deadline ? new Date(item.deadline) : undefined,
        }));
        setEvents(mapped);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Fetch user events (registered/attended)
  useEffect(() => {
    if (!walletAddress) return;
    Promise.all([
      axios.get(baseUrl + `/events/by-participant/${walletAddress}`),
      axios.get(
        baseUrl + `/events/competition/by-participant/${walletAddress}`,
      ),
    ]).then(([eventsRes, competitionsRes]) => {
      const eventsMapped = eventsRes.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        date: item.date ? new Date(item.date) : undefined,
        deadline: item.deadline ? new Date(item.deadline) : undefined,
      }));
      const competitionsMapped = competitionsRes.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        date: item.date ? new Date(item.date) : undefined,
        deadline: item.deadline ? new Date(item.deadline) : undefined,
      }));
      setUserEvents((prev) => ({
        ...prev,
        registered: [...eventsMapped, ...competitionsMapped],
      }));
    });
    // TODO: If you have attended events API, fetch and set attended
  }, [walletAddress]);

  // Filtered events/competitions
  const filteredEvents = events.filter((item) =>
    activeTab === "events"
      ? item.type === "event"
      : item.type === "competition",
  );

  const todayEvents = filteredEvents.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString(),
  );

  const upcomingEvents = filteredEvents.filter(
    (e) => new Date(e.date) > new Date() && e.status === "upcoming",
  );

  const ongoingCompetitions = filteredEvents.filter(
    (e) => e.type === "competition" && e.status === "ongoing",
  );

  const upcomingCompetitions = filteredEvents.filter(
    (e) => e.type === "competition" && e.status === "upcoming",
  );

  // Register event/competition
  const handleRegister = useCallback(async () => {
    if (!selectedItem || !walletAddress) return;
    // Check if already registered (frontend check)
    const isAlreadyRegistered = userEvents.registered.some(
      (event) => event.id === selectedItem.id,
    );
    if (isAlreadyRegistered) {
      toast.error("Bạn đã đăng ký sự kiện/cuộc thi này!");
      return;
    }
    // Check capacity
    if (selectedItem.participants.count >= (selectedItem.capacity || 999999)) {
      toast.error("Sự kiện đã đạt số lượng người tham gia tối đa!");
      return;
    }
    // Call API
    try {
      const isCompetition = selectedItem.type === "competition";
      const url = isCompetition
        ? baseUrl + `/events/competition/${selectedItem.id}/register`
        : baseUrl + `/events/${selectedItem.id}/register`;
      await axios.post(url, {
        id: walletAddress,
        avatar: "/avatars/default.jpg",
      });
      toast.success("Đăng ký thành công!", {
        description: `Bạn đã đăng ký tham gia "${selectedItem.title}"`,
      });
      // Refetch user events
      axios
        .get(baseUrl + `/events/by-participant/${walletAddress}`)
        .then((res) => {
          const mapped = res.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            date: item.date ? new Date(item.date) : undefined,
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }));
          setUserEvents((prev) => ({ ...prev, registered: mapped }));
        });
      // Refetch all events to update participants count
      axios
        .get(baseUrl + (isCompetition ? "/events/competition" : "/events"))
        .then((res) => {
          const mapped = res.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            date: item.date ? new Date(item.date) : undefined,
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }));
          setEvents(mapped);
          // Nếu modal đang mở, fetch lại event/competition vừa đăng ký và cập nhật selectedItem
          if (selectedItem) {
            const detailUrl = isCompetition
              ? baseUrl + `/events/competition/${selectedItem.id}`
              : baseUrl + `/events/${selectedItem.id}`;
            axios.get(detailUrl).then((detailRes) => {
              const updated = {
                ...detailRes.data,
                id: detailRes.data._id || detailRes.data.id,
                date: detailRes.data.date
                  ? new Date(detailRes.data.date)
                  : undefined,
                deadline: detailRes.data.deadline
                  ? new Date(detailRes.data.deadline)
                  : undefined,
              };
              setSelectedItem(updated);
            });
          }
        });
    } catch (e: any) {
      if (e.response && e.response.status === 409 && e.response.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Đăng ký thất bại!");
      }
    }
  }, [selectedItem, walletAddress, userEvents.registered]);

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString(),
    );
  };

  // handleCreateEvent
  const handleCreateEvent = async () => {
    setFormLoading(true);
    try {
      let organizer = {
        id: walletAddress,
        name: walletAddress?.slice(0, 8) || "Unknown",
        avatar: "/avatars/default.jpg",
      };
      if (walletAddress) {
        try {
          const userRes = await axios.get(baseUrl + `/user/${walletAddress}`);
          if (userRes.data) {
            organizer = {
              id: walletAddress,
              name: userRes.data.username || walletAddress.slice(0, 8),
              avatar: userRes.data.profilePicture || "/avatars/default.jpg",
            };
          }
        } catch {}
      }
      await axios.post(baseUrl + "/events", {
        title: formDataEvent.title,
        date: formDataEvent.date,
        startTime: formDataEvent.startTime,
        endTime: formDataEvent.endTime,
        location: {
          address: formDataEvent.location,
          city: formDataEvent.category,
        },
        organizer,
        participants: { count: 0, registered: [] },
        status: "upcoming",
        imageUrl: formDataEvent.imageUrl,
        description: formDataEvent.description,
        type: "event",
        category: formDataEvent.category,
      });
      toast.success("Gửi sự kiện thành công!");
      setOpenEventDialog(false);
      setStepEvent(0);
      setFormDataEvent({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
        imageUrl: "",
        category: "",
        type: "event",
      });
      setLoading(true);
      axios
        .get(baseUrl + "/events")
        .then((res) => {
          const mapped = res.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            date: item.date ? new Date(item.date) : undefined,
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }));
          setEvents(mapped);
        })
        .finally(() => setLoading(false));
    } catch (e) {
      toast.error("Gửi sự kiện thất bại!");
    } finally {
      setFormLoading(false);
    }
  };

  // handleCreateCompetition
  const handleCreateCompetition = async () => {
    setFormLoading(true);
    try {
      let organizer = {
        id: walletAddress,
        name: walletAddress?.slice(0, 8) || "Unknown",
        avatar: "/avatars/default.jpg",
      };
      if (walletAddress) {
        try {
          const userRes = await axios.get(baseUrl + `/user/${walletAddress}`);
          if (userRes.data) {
            organizer = {
              id: walletAddress,
              name: userRes.data.username || walletAddress.slice(0, 8),
              avatar: userRes.data.profilePicture || "/avatars/default.jpg",
            };
          }
        } catch {}
      }
      await axios.post(baseUrl + "/events/competition", {
        title: formDataCompetition.title,
        date: formDataCompetition.date,
        startTime: formDataCompetition.startTime,
        endTime: formDataCompetition.endTime,
        location: {
          address: formDataCompetition.location,
          city: formDataCompetition.category,
        },
        organizer,
        participants: { count: 0, registered: [] },
        status: "upcoming",
        imageUrl: formDataCompetition.imageUrl,
        description: formDataCompetition.description,
        type: "competition",
        category: formDataCompetition.category,
        prize: formDataCompetition.prize,
        requirements: formDataCompetition.requirements
          ? formDataCompetition.requirements
              .split("\n")
              .map((r) => r.trim())
              .filter(Boolean)
          : [],
        deadline: formDataCompetition.deadline,
      });
      toast.success("Tạo cuộc thi thành công!");
      setOpenCompetitionDialog(false);
      setStepCompetition(0);
      setFormDataCompetition({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
        imageUrl: "",
        category: "",
        prize: "",
        requirements: "",
        deadline: "",
        type: "competition",
      });
      setLoading(true);
      axios
        .get(baseUrl + "/events/competition")
        .then((res) => {
          const mapped = res.data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            date: item.date ? new Date(item.date) : undefined,
            deadline: item.deadline ? new Date(item.deadline) : undefined,
          }));
          setEvents(mapped);
        })
        .finally(() => setLoading(false));
    } catch (e) {
      toast.error("Tạo cuộc thi thất bại!");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    // Connect to the backend gateway (adjust the URL if needed)
    const socket: Socket = io(baseUrl.replace(/\/api$/, ""));

    socket.on("eventCreated", (event) => {
      setEvents((prev) => [{ ...event, id: event._id || event.id }, ...prev]);
      toast.success("Sự kiện mới được tạo!", { description: event.title });
    });

    socket.on("competitionCreated", (competition) => {
      setEvents((prev) => [
        { ...competition, id: competition._id || competition.id },
        ...prev,
      ]);
      toast.success("Cuộc thi mới được tạo!", {
        description: competition.title,
      });
    });

    socket.on("participantRegistered", ({ type, item, participant }) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === item._id || e.id === item.id
            ? { ...item, id: item._id || item.id }
            : e,
        ),
      );
      toast("Có người vừa đăng ký tham gia!", {
        description: `${participant.id} đã đăng ký ${type === "event" ? "sự kiện" : "cuộc thi"} "${item.title}"`,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="container mx-auto flex flex-col gap-4 p-2 md:flex-row md:gap-6 md:p-6">
        {/* Main Content */}
        <div className="max-h-[calc(100vh-2rem)] w-full overflow-auto pb-4 md:w-3/4 md:pb-0">
          <div className="mb-4 flex flex-col items-start justify-between gap-2 md:mb-6 md:flex-row md:items-center md:gap-0">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setActiveTab("events")}
                className={`border-b-2 pb-2 text-base font-bold md:text-2xl ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                Sự kiện
              </button>
              <button
                onClick={() => setActiveTab("competitions")}
                className={`border-b-2 pb-2 text-base font-bold md:text-2xl ${
                  activeTab === "competitions"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                Cuộc thi
              </button>
            </div>
            <div className="flex w-full gap-2 md:w-auto md:gap-4">
              <button
                className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm shadow-sm hover:bg-gray-200 md:flex-none dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={() => {
                  if (activeTab === "events") setOpenEventDialog(true);
                  else setOpenCompetitionDialog(true);
                }}
              >
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
          <div className="space-y-4 pr-0 md:space-y-6 md:pr-4">
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
        <div className="mt-4 w-full space-y-4 md:mt-0 md:w-1/4 md:space-y-6">
          <div className="sticky top-4 space-y-4 md:top-6 md:space-y-6">
            {/* Calendar Section */}
            <div className="rounded-xl bg-gray-50 p-3 shadow-lg md:p-4 dark:bg-zinc-900">
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
            <div className="rounded-xl bg-gray-50 p-3 shadow-lg md:p-4 dark:bg-zinc-900">
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
                          src={
                            event.imageUrl ||
                            "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400"
                          }
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
                          src={
                            event.imageUrl ||
                            "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400"
                          }
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
      <EventModal
        item={selectedItem!}
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
        onRegister={handleRegister}
      />

      {/* Dialog for event */}
      {activeTab === "events" && (
        <Dialog
          open={openEventDialog}
          onOpenChange={(open) => {
            setOpenEventDialog(open);
            if (!open) {
              setStepEvent(0);
              setFormDataEvent({
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                location: "",
                description: "",
                imageUrl: "",
                category: "",
                type: "event",
              });
            }
          }}
        >
          <DialogContent className="w-full max-w-lg overflow-hidden">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Gửi sự kiện mới</DialogTitle>
            </DialogHeader>
            <form
              className="flex max-h-[80vh] flex-col gap-6 overflow-y-auto px-6 pb-6 pt-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateEvent();
              }}
            >
              <div>
                <Label htmlFor="title">Tên sự kiện</Label>
                <Input
                  id="title"
                  value={formDataEvent.title}
                  onChange={(e) =>
                    setFormDataEvent((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formDataEvent.date}
                    onChange={(e) =>
                      setFormDataEvent((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="category">Thành phố</Label>
                  <Input
                    id="category"
                    value={formDataEvent.category}
                    onChange={(e) =>
                      setFormDataEvent((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="startTime">Bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formDataEvent.startTime}
                    onChange={(e) =>
                      setFormDataEvent((f) => ({
                        ...f,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="endTime">Kết thúc</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formDataEvent.endTime}
                    onChange={(e) =>
                      setFormDataEvent((f) => ({
                        ...f,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Ảnh (URL)</Label>
                <Input
                  id="imageUrl"
                  value={formDataEvent.imageUrl}
                  onChange={(e) =>
                    setFormDataEvent((f) => ({
                      ...f,
                      imageUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Địa chỉ</Label>
                <Input
                  id="location"
                  value={formDataEvent.location}
                  onChange={(e) =>
                    setFormDataEvent((f) => ({
                      ...f,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formDataEvent.description}
                  onChange={(e) =>
                    setFormDataEvent((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEventDialog(false)}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Đang gửi..." : "Gửi sự kiện"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for competition */}
      {activeTab === "competitions" && (
        <Dialog
          open={openCompetitionDialog}
          onOpenChange={(open) => {
            setOpenCompetitionDialog(open);
            if (!open) {
              setStepCompetition(0);
              setFormDataCompetition({
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                location: "",
                description: "",
                imageUrl: "",
                category: "",
                prize: "",
                requirements: "",
                deadline: "",
                type: "competition",
              });
            }
          }}
        >
          <DialogContent className="w-full max-w-lg overflow-hidden">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Tạo cuộc thi mới</DialogTitle>
            </DialogHeader>
            <form
              className="flex max-h-[80vh] flex-col gap-6 overflow-y-auto px-6 pb-6 pt-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCompetition();
              }}
            >
              <div>
                <Label htmlFor="title">Tên cuộc thi</Label>
                <Input
                  id="title"
                  value={formDataCompetition.title}
                  onChange={(e) =>
                    setFormDataCompetition((f) => ({
                      ...f,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formDataCompetition.date}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        date: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="deadline">Hạn chót đăng ký</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formDataCompetition.deadline}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        deadline: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="startTime">Bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formDataCompetition.startTime}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="endTime">Kết thúc</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formDataCompetition.endTime}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Ảnh (URL)</Label>
                <Input
                  id="imageUrl"
                  value={formDataCompetition.imageUrl}
                  onChange={(e) =>
                    setFormDataCompetition((f) => ({
                      ...f,
                      imageUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="location">Địa chỉ</Label>
                  <Input
                    id="location"
                    value={formDataCompetition.location}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        location: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="category">Thành phố</Label>
                  <Input
                    id="category"
                    value={formDataCompetition.category}
                    onChange={(e) =>
                      setFormDataCompetition((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="prize">Giải thưởng</Label>
                <Input
                  id="prize"
                  value={formDataCompetition.prize}
                  onChange={(e) =>
                    setFormDataCompetition((f) => ({
                      ...f,
                      prize: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formDataCompetition.description}
                  onChange={(e) =>
                    setFormDataCompetition((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="requirements">
                  Yêu cầu (mỗi dòng 1 yêu cầu)
                </Label>
                <Textarea
                  id="requirements"
                  value={formDataCompetition.requirements}
                  onChange={(e) =>
                    setFormDataCompetition((f) => ({
                      ...f,
                      requirements: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenCompetitionDialog(false)}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Đang tạo..." : "Tạo cuộc thi"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
