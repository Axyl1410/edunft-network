"use client"
import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Users, Calendar, Search, RssIcon } from "lucide-react";

interface Event {
  id: string;
  name: string;
  time: string;
  date: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
  };
  participants: number;
  imageUrl: string;
  isToday?: boolean;
}

const eventsData: Event[] = [
  {
    id: "1",
    name: "Harvard Business School Faculty Talk: Prof. Hise Gibson",
    time: "19:00",
    date: "Hôm nay",
    location: "Quận 3, Hồ Chí Minh",
    organizer: {
      name: "Stephen & Nguyen",
      avatar: "/avatars/stephen.jpg"
    },
    participants: 24,
    imageUrl: "/images/harvard.jpg",
    isToday: true
  },
  {
    id: "2",
    name: "SHATTERLINE TOURNAMENT",
    time: "8:30",
    date: "17 thg 5",
    location: "Đường Thống Nhất",
    organizer: {
      name: "VERSAL STUDIOS & Thuy Nguyen",
      avatar: "/avatars/versal.jpg"
    },
    participants: 44,
    imageUrl: "/images/shatterline.jpg"
  },
  // Add more events...
];

export default function Events() {
  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-6 flex gap-6">
        {/* Main Content */}
        <div className="w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sự kiện</h1>
            <div className="flex gap-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full flex items-center gap-2">
                <RssIcon size={20} />
                Gửi sự kiện
              </button>
              <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div>
              <h2 className="text-gray-400 mb-4">Hôm nay • Thứ Năm</h2>
              {eventsData.filter(e => e.isToday).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Future Events */}
            <div>
              <h2 className="text-gray-400 mb-4">17 thg 5 • Thứ Bảy</h2>
              {eventsData.filter(e => !e.isToday).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-zinc-900 rounded-xl p-4">
            <h2 className="text-xl font-bold mb-2">TP. Hồ Chí Minh</h2>
            <p className="text-gray-400 text-sm mb-4">
              Khám phá những sự kiện nổi bật nhất tại TP. Hồ Chí Minh, và nhận thông báo về các sự kiện mới trước khi chúng hết vé.
            </p>
            <button className="w-full bg-white text-black font-semibold py-2 rounded-full hover:bg-gray-200 transition">
              Theo dõi
            </button>
            <div className="mt-4 bg-zinc-800 rounded-xl h-64 overflow-hidden">
              {/* Add your map component here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-zinc-900 rounded-xl p-4 mb-4 hover:bg-zinc-800 transition cursor-pointer">
        <div className="flex gap-4">
          <div className="w-24 text-xl font-semibold">
            {event.time}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{event.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-400">Bởi {event.organizer.name}</span>
            </div>
          </div>
          {event.imageUrl && (
            <div className="w-32 h-32">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
