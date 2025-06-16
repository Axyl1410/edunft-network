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
import Loading from "@workspace/ui/components/loading";
import { Textarea } from "@workspace/ui/components/textarea";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { CalendarSection } from "./_components/CalendarSection";
import { CompetitionList } from "./_components/CompetitionList";
import { EventActionButtons } from "./_components/EventActionButtons";
import { EventList } from "./_components/EventList";
import { EventModal } from "./_components/EventModal";
import RegisteredEventsSection from "./_components/RegisteredEventsSection";
import { TabSwitcher } from "./_components/TabSwitcher";
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
  const [userEventsLoading, setUserEventsLoading] = useState(false);
  const [userEventsError, setUserEventsError] = useState<string | null>(null);
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
    setUserEventsLoading(true);
    setUserEventsError(null);
    Promise.all([
      axios.get(baseUrl + `/events/by-participant/${walletAddress}`),
      axios.get(
        baseUrl + `/events/competition/by-participant/${walletAddress}`,
      ),
    ])
      .then(([eventsRes, competitionsRes]) => {
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
        setUserEventsLoading(false);
      })
      .catch((err) => {
        setUserEventsError("Không thể tải sự kiện của bạn. Vui lòng thử lại.");
        setUserEventsLoading(false);
      });
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

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="container mx-auto flex flex-col gap-4 p-2 md:flex-row md:gap-6 md:p-6">
        {/* Main Content */}
        <div className="max-h-[calc(100vh-2rem)] w-full overflow-auto pb-4 md:w-3/4 md:pb-0">
          <div className="mb-4 flex flex-col items-start justify-between gap-2 md:mb-6 md:flex-row md:items-center md:gap-0">
            <div className="flex items-center gap-3">
              <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="flex items-center gap-1 rounded-md border bg-white/80 px-2 py-0.5 shadow-sm dark:bg-neutral-900">
                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                  Live
                </p>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
                </span>
              </div>
            </div>
            <EventActionButtons
              activeTab={activeTab}
              setOpenEventDialog={setOpenEventDialog}
              setOpenCompetitionDialog={setOpenCompetitionDialog}
            />
          </div>

          {/* Timeline Events with scroll */}
          <div className="space-y-4 pr-0 md:space-y-6 md:pr-4">
            {loading ? (
              <div className="py-8 text-center">
                <Loading text="Đang tải dữ liệu..." />
              </div>
            ) : activeTab === "events" ? (
              <EventList
                todayEvents={todayEvents as Event[]}
                upcomingEvents={upcomingEvents as Event[]}
                setSelectedItem={setSelectedItem}
              />
            ) : (
              <CompetitionList
                ongoingCompetitions={ongoingCompetitions as Competition[]}
                upcomingCompetitions={upcomingCompetitions as Competition[]}
                setSelectedItem={setSelectedItem}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-4 w-full space-y-4 md:mt-0 md:w-1/4 md:space-y-6">
          <div className="sticky top-4 space-y-4 md:top-6 md:space-y-6">
            <CalendarSection
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              date={date}
              setDate={setDate}
              events={events}
              getEventsForDate={getEventsForDate}
              setSelectedItem={setSelectedItem}
              toast={toast}
            />
            <RegisteredEventsSection
              userEvents={userEvents}
              loading={userEventsLoading}
              error={userEventsError}
            />
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
