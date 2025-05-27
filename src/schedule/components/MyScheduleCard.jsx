import Tag from "../../shared/components/Tag";

export default function MyScheduleCard({ scheduleData, index, onDelete }) {
  const { date, start_time, end_time, slot_duration, is_available } =
    scheduleData;

  return (
    <div className="flex flex-row gap-2 p-4 w-full shadow-md items-center flex-wrap">
      <div className="text-red-900 font-bold w-16">{index + 1}</div>
      <div className="text-red-900 font-bold mr-8">
        Date: <span className="text-black font-medium">{date}</span>
      </div>
      <div className="text-red-900 font-bold mr-8">
        Time:{" "}
        <span className="text-black font-medium">
          {start_time} - {end_time}
        </span>
      </div>
      <div className="text-red-900 font-bold mr-8">
        Duration:{" "}
        <span className="text-black font-medium">{slot_duration} mins</span>
      </div>
      <div className="flex-1">
        {is_available ? (
          <Tag text={"Available"} type={"success"} />
        ) : (
          <Tag text={"Not available"} type={"error"} />
        )}
      </div>
      <button onClick={() => onDelete(scheduleData.id)} className="border border-red-500 rounded-sm text-red-500 px-4 py-1 cursor-pointer hover:bg-red-500 hover:text-white duration-200">
        Delete
      </button>
    </div>
  );
}
