import { useEffect } from "react";
import { useAuthStore } from "../layouts/stores/authStore";
import { useNavigate } from "react-router";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useState } from "react";
import MyScheduleCard from "./components/MyScheduleCard";
import Alert from "../shared/components/Alert";
import Tag from "../shared/components/Tag";

export default function DoctorSchedule() {
  const user = useAuthStore((state) => state.user);
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [isAlertShow, setIsAlertShow] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  useEffect(() => {
    if (!user || !user.is_doctor) {
      navigate("/dashboard");
    }
  }, [user]);

  function handleDeleteClick(id) {
    setIsAlertShow(true);
    setCurrentDeleteId(id);
  }

  function handleAlertCancel() {
    setIsAlertShow(false);
    setCurrentDeleteId(null);
  }

  function handleAlertOK() {
    if (currentDeleteId === null) {
      setIsAlertShow(false);
      return;
    }

    setLoading(true);
    appointmentsApi
      .deleteMySchedule(currentDeleteId)
      .then((res) => {
        toast.success("Delete successfully");
        setSchedules((state) =>
          state.filter((item) => item.id !== currentDeleteId),
        );
        setCurrentDeleteId(null);
        setIsAlertShow(false);
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
        setCurrentDeleteId(null);
        setIsAlertShow(false);
      })
      .finally(() => {
        setLoading(false);
      });

    setIsAlertShow(false);
  }

  useEffect(() => {
    setLoading(true);
    appointmentsApi
      .getMySchedules()
      .then((res) => {
        setSchedules(res);
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-md shadow-md px-8 pt-2 pb-8">
      <div className="text-lg text-red-900 font-bold mb-2">My schedules:</div>
      {schedules.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-red-100 rounded-md">
            <thead className="bg-red-100 text-red-900">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr
                  key={schedule.id}
                  className="border-t hover:bg-red-50 transition-colors"
                >
                  <td className="px-4 py-2 font-bold text-red-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">{schedule.date}</td>
                  <td className="px-4 py-2">
                    {schedule.start_time} - {schedule.end_time}
                  </td>
                  <td className="px-4 py-2">{schedule.slot_duration} mins</td>
                  <td className="px-4 py-2">
                    <Tag
                      text={
                        schedule.is_available ? "Available" : "Not available"
                      }
                      type={schedule.is_available ? "success" : "error"}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(schedule.id)}
                      className="cursor-pointer border border-red-500 rounded-sm text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-red-900 italic">You have no schedules...</div>
      )}
      {isAlertShow && (
        <Alert
          title={"Delete"}
          onCancel={handleAlertCancel}
          onOK={handleAlertOK}
          type={"danger"}
        >
          Deletion is irreversible, are you sure you want to proceed?
        </Alert>
      )}
    </div>
  );
}
