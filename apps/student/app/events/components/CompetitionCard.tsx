import { Clock, Users } from "lucide-react";
import { motion } from "motion/react";
interface Competition {
  imageUrl: string;
  title: string;
  status: 'ongoing' | 'upcoming';
  deadline: Date;
  participants: {
    count: number;
  };
  capacity: number;
  prize: string;
}

interface CompetitionCardProps {
  competition: Competition;
  onClick?: (competition: Competition) => void;
}

export function CompetitionCard({ competition, onClick }: CompetitionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick?.(competition)}
      className="bg-white dark:bg-zinc-900 rounded-xl p-4 mb-4 shadow-sm border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <img src={competition.imageUrl} alt={competition.title} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{competition.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${competition.status === 'ongoing' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-blue-100 text-blue-600'}`}
            >
              {competition.status === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Hạn chót: {competition.deadline.toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{competition.participants.count}/{competition.capacity} người tham gia</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Giải thưởng:</span> {competition.prize}
          </div>
        </div>
      </div>
    </motion.div>
  );
}