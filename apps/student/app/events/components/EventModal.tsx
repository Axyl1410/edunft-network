import { X, Clock, MapPin, Users, Trophy } from "lucide-react";
import { Event, Competition } from "../types";



interface EventModalProps {
  item: Event | Competition;
  onClose: () => void;
  onRegister: () => void;
}

export function EventModal({ item, onClose, onRegister }: EventModalProps) {
  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-[380px] md:w-[480px] bg-white dark:bg-zinc-900 shadow-2xl p-4 sm:p-6 overflow-y-auto animate-slide-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Chi tiết</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
          <X size={20} />
        </button>
      </div>

      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-6" />

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-2">{item.title}</h1>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${item.status === 'ongoing' 
                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'}`}
            >
              {item.status === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
            </span>
            {'category' in item && (
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-sm">
                {item.category}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              {item.startTime} - {item.endTime} • {item.date.toLocaleDateString('vi-VN')}
              {'deadline' in item && (
                <div className="mt-1">Hạn chót đăng ký: {(item as Competition).deadline.toLocaleDateString('vi-VN')}</div>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{item.location.address}, {item.location.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{item.participants.count}/{item.capacity} người tham gia</span>
          </div>

          {'prize' in item && (
            <div className="flex items-center gap-2">
              <Trophy size={16} />
              <span>Giải thưởng: {(item as Competition).prize}</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Mô tả</h3>
          <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>

        {'requirements' in item && (
          <div>
            <h3 className="font-semibold mb-2">Yêu cầu</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {(item as Competition).requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onRegister}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          Đăng ký tham gia
        </button>
      </div>
    </div>
  );
}