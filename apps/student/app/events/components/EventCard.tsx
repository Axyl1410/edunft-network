import { Event } from "../types";
import { Clock, MapPin, Users, Calendar } from "lucide-react";
import { motion } from "motion/react";

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
        className="bg-white dark:bg-zinc-900 rounded-xl p-6 mb-4 shadow-sm"
      >
        <div className="flex flex-col items-center justify-center text-center gap-3">
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
      className="bg-white dark:bg-zinc-900 rounded-xl p-4 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{event.title}</h3>
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