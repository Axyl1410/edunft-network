interface RegisteredEventsSectionProps {
  userEvents: {
    registered: any[];
    attended: any[];
  };
  loading?: boolean;
  error?: string | null;
}

const RegisteredEventsSection = ({
  userEvents,
  loading,
  error,
}: RegisteredEventsSectionProps) => {
  return (
    <div className="rounded-xl bg-neutral-50 p-3 shadow-lg md:p-4 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-bold">Sự kiện của bạn</h2>
      {loading ? (
        <div className="py-8 text-center text-neutral-500">Đang tải...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : userEvents.registered.length === 0 &&
        userEvents.attended.length === 0 ? (
        <div className="py-8 text-center text-neutral-400">
          Bạn chưa có sự kiện nào.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              Registered
            </h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {userEvents.registered.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800"
                >
                  <img
                    src={
                      event.imageUrl ||
                      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400"
                    }
                    alt={event.title}
                    className="h-8 w-8 rounded"
                  />
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium">
                      {event.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              Attended
            </h3>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {userEvents.attended.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800"
                >
                  <img
                    src={
                      event.imageUrl ||
                      "https://robohash.org/b809f288d1ded8f540c05916cf58cf82?set=set4&bgset=&size=400x400"
                    }
                    alt={event.title}
                    className="h-8 w-8 rounded"
                  />
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium">
                      {event.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {event.startTime}
                    </p>
                  </div>
                  <span className="text-green-500">●</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredEventsSection;
