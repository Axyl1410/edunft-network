import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { motion } from "motion/react";
import { Event } from "../types";

interface EventCardProps {
  event?: Event;
  isEmpty?: boolean;
  onClick?: (event: Event) => void;
}

export function EventCard({ event, isEmpty, onClick }: EventCardProps) {
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Calendar size={40} className="text-gray-400 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
            Không có sự kiện nào trong thời gian này
          </p>
        </div>
      </motion.div>
    );
  }

  if (!event) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick?.(event)}
      className="mb-4 cursor-pointer rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
    >
      <div className="flex items-start gap-4">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-20 w-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="mb-2 font-semibold">{event.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{event.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{event.location.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{event.participants.count} người tham gia</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
