import { Trophy } from "lucide-react";
import { Competition } from "../types";
import { CompetitionCard } from "./CompetitionCard";

interface CompetitionListProps {
  ongoingCompetitions: Competition[];
  upcomingCompetitions: Competition[];
  setSelectedItem: (item: Competition) => void;
}

export function CompetitionList({
  ongoingCompetitions,
  upcomingCompetitions,
  setSelectedItem,
}: CompetitionListProps) {
  return (
    <>
      {/* Ongoing Competitions */}
      <div className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-neutral-200 dark:bg-zinc-800"></div>
        <div className="relative pl-10">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 shadow-sm dark:bg-zinc-800">
            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          </div>
          <h2 className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Cuộc thi đang diễn ra
          </h2>
          {ongoingCompetitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              onClick={() => setSelectedItem(competition)}
            />
          ))}
        </div>
      </div>
      {/* Upcoming Competitions */}
      <div className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-neutral-200 dark:bg-zinc-800"></div>
        <div className="relative pl-10">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 shadow-sm dark:bg-zinc-800">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <h2 className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            Cuộc thi sắp tới
          </h2>
          {upcomingCompetitions.length > 0 ? (
            upcomingCompetitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onClick={() => setSelectedItem(competition)}
              />
            ))
          ) : (
            <div className="mb-4 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
              <div className="ITEMS-center flex flex-col justify-center gap-3 text-center">
                <Trophy
                  size={40}
                  className="text-neutral-400 dark:text-neutral-600"
                />
                <p className="text-neutral-500 dark:text-neutral-400">
                  Không có cuộc thi nào sắp diễn ra
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
