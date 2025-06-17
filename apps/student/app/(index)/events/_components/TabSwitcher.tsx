interface TabSwitcherProps {
  activeTab: "events" | "competitions";
  setActiveTab: (tab: "events" | "competitions") => void;
}

export function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <button
        onClick={() => setActiveTab("events")}
        className={`border-b-2 pb-2 text-base font-bold md:text-2xl ${
          activeTab === "events"
            ? "border-blue-500 text-blue-500"
            : "border-transparent hover:border-neutral-200"
        }`}
      >
        Sự kiện
      </button>
      <button
        onClick={() => setActiveTab("competitions")}
        className={`border-b-2 pb-2 text-base font-bold md:text-2xl ${
          activeTab === "competitions"
            ? "border-blue-500 text-blue-500"
            : "border-transparent hover:border-neutral-200"
        }`}
      >
        Cuộc thi
      </button>
    </div>
  );
}
