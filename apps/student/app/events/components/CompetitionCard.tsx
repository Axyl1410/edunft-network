import { Clock, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Competition } from "../types";

interface CompetitionCardProps {
  competition: Competition;
  onClick?: (competition: Competition) => void;
}

export function CompetitionCard({
  competition,
  onClick,
}: CompetitionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick?.(competition)}
      className="mb-4 cursor-pointer rounded-xl border-l-4 border-orange-500 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
    >
      <div className="flex items-start gap-4">
        <img
          src={competition.imageUrl}
          alt={competition.title}
          className="h-20 w-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-semibold">{competition.title}</h3>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                competition.status === "ongoing"
                  ? "bg-orange-100 text-orange-600"
                  : competition.status === "upcoming"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {competition.status === "ongoing"
                ? "Đang diễn ra"
                : competition.status === "upcoming"
                  ? "Sắp diễn ra"
                  : "Đã kết thúc"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                Hạn chót: {competition.deadline.toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>
                {competition.participants.count}/{competition.capacity ?? "?"}{" "}
                người tham gia
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Giải thưởng:</span>{" "}
            {competition.prize}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
