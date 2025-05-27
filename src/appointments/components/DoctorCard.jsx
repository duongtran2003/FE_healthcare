export default function DoctorCard({ doctorInfo, onClick }) {
  return (
    <div className="p-4 bg-white shadow-md rounded-sm">
      <div className="font-bold">{`Dr. ${doctorInfo.user.first_name} ${doctorInfo.user.last_name}`}</div>
      <button
        onClick={() => onClick(doctorInfo.id)}
        className="border border-red-900 rounded-sm px-4 bg-white py-1.5 mt-2 text-red-900 cursor-pointer hover:bg-red-900 hover:text-white duration-100"
      >
        View schedules & book
      </button>
    </div>
  );
}
