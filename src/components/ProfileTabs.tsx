interface ProfileTabsProps {
  activeTab: "properties" | "bookings";
  onTabChange: (tab: "properties" | "bookings") => void;
  propertiesCount: number;
  bookingsCount: number;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
  propertiesCount,
  bookingsCount,
}: ProfileTabsProps) {
  return (
    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => onTabChange("properties")}
        className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
          activeTab === "properties"
            ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
            : "border-transparent text-zinc-500 hover:text-zinc-700"
        }`}
      >
        My Properties ({propertiesCount})
      </button>

      <button
        onClick={() => onTabChange("bookings")}
        className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
          activeTab === "bookings"
            ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
            : "border-transparent text-zinc-500 hover:text-zinc-700"
        }`}
      >
        My Bookings ({bookingsCount})
      </button>
    </div>
  );
}