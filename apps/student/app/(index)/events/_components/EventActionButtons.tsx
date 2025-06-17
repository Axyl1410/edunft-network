import { Plus, RssIcon, Search } from "lucide-react";

interface EventActionButtonsProps {
  activeTab: "events" | "competitions";
  setOpenEventDialog: (open: boolean) => void;
  setOpenCompetitionDialog: (open: boolean) => void;
}

export function EventActionButtons({
  activeTab,
  setOpenEventDialog,
  setOpenCompetitionDialog,
}: EventActionButtonsProps) {
  return (
    <div className="flex w-full gap-2 md:w-auto md:gap-4">
      <button
        className="flex flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm shadow-sm hover:bg-neutral-200 md:flex-none dark:bg-zinc-800 dark:hover:bg-zinc-700"
        onClick={() => {
          if (activeTab === "events") setOpenEventDialog(true);
          else setOpenCompetitionDialog(true);
        }}
      >
        <Plus size={18} />
        {activeTab === "events" ? "Gửi sự kiện" : "Tạo cuộc thi"}
      </button>
      <button className="rounded-full bg-neutral-100 p-2 shadow-sm hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
        <RssIcon size={18} />
      </button>
      <button className="rounded-full bg-neutral-100 p-2 shadow-sm hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
        <Search size={18} />
      </button>
    </div>
  );
}
