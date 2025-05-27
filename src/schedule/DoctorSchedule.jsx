import { useEffect } from "react";
import { useAuthStore } from "../layouts/stores/authStore";
import { useNavigate } from "react-router";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useState } from "react";
import MyScheduleCard from "./components/MyScheduleCard";
import Alert from "../shared/components/Alert";

export default function DoctorSchedule() {
  const user = useAuthStore((state) => state.user);
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [isAlertShow, setIsAlertShow] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  useEffect(() => {
    if (!user) {
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
      <div className="text-lg text-red-900 font-bold">My schedules:</div>
      <div className="flex flex-col gap-2">
        {schedules.length > 0 ? (
          schedules.map((schedule, index) => (
            <MyScheduleCard
              scheduleData={schedule}
              index={index}
              key={index}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="text-red-900 italic">You have no schedules...</div>
        )}
      </div>
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
