import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Clock, MapPin, Trophy, Users } from "lucide-react";
import { Competition, Event } from "../types";

interface EventModalProps {
  item: Event | Competition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
}

export function EventModal({
  item,
  open,
  onOpenChange,
  onRegister,
}: EventModalProps) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết</DialogTitle>
        </DialogHeader>
        <img
          src={
            item.imageUrl ||
            "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400"
          }
          alt={item.title}
          className="mb-6 h-48 w-full rounded-xl object-cover"
        />
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  item.status === "ongoing"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                }`}
              >
                {item.status === "ongoing" ? "Đang diễn ra" : "Sắp diễn ra"}
              </span>
              {"category" in item && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-zinc-800">
                  {item.category}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                {item.startTime} - {item.endTime} •{" "}
                {new Date(item.date).toLocaleDateString("vi-VN")}
                {"deadline" in item && (
                  <div className="mt-1">
                    Hạn chót đăng ký:{" "}
                    {new Date(
                      (item as Competition).deadline,
                    ).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>
                {item.location.address}, {item.location.city}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>
                {item.participants.count}/{item.capacity} người tham gia
              </span>
            </div>

            {"prize" in item && (
              <div className="flex items-center gap-2">
                <Trophy size={16} />
                <span>Giải thưởng: {(item as Competition).prize}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Mô tả</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {item.description}
            </p>
          </div>

          {"requirements" in item && (
            <div>
              <h3 className="mb-2 font-semibold">Yêu cầu</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
                {(item as Competition).requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <button
            onClick={onRegister}
            className="w-full rounded-xl bg-blue-500 py-3 font-medium text-white hover:bg-blue-600"
          >
            Đăng ký tham gia
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
