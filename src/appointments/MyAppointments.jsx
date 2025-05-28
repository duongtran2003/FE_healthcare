import { useState } from "react";
import Alert from "../shared/components/Alert";
import { useAuthStore } from "../layouts/stores/authStore";
import { useEffect } from "react";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { useMemo } from "react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isAlertShow, setIsAlertShow] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const [currentTab, setCurrentTab] = useState("Upcoming");
  const [currentCancelId, setCurrentCancelId] = useState(null);

  function handleCancelClick(id) {
    setCurrentCancelId(id);
    setIsAlertShow(true);
  }

  function handleAlertOK() {
    if (!currentCancelId) {
      return;
    }

    setLoading(true);
    appointmentsApi
      .deleteAppointment(currentCancelId)
      .then((res) => {
        setAppointments((appointments) =>
          appointments.map((appointment) => {
            return {
              ...appointment,
              status:
                appointment.id == currentCancelId
                  ? "Cancelled"
                  : appointment.status,
            };
          }),
        );
        toast.success("Cancelled successfully");
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
      })
      .finally(() => {
        setLoading(false);
        setIsAlertShow(false);
      });
  }

  function handleAlertCancel() {
    setCurrentCancelId(null);
    setIsAlertShow(false);
  }

  useEffect(() => {
    setLoading(true);
    if (user?.is_patient) {
      appointmentsApi
        .getMyAppointments("patient")
        .then((res) => {
          setAppointments(mapAppointments(res));
        })
        .catch((err) => {
          toast.error("Something has gone wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      appointmentsApi
        .getMyAppointments("doctor")
        .then((res) => {
          setAppointments(mapAppointments(res));
        })
        .catch((err) => {
          toast.error("Something has gone wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  function mapAppointments(appointments) {
    return appointments.map((appointment) => {
      return {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time + " " + appointment.end_time,
        user: user?.is_patient
          ? appointment.doctor_details.name
          : appointment.patient_details.name,
        subText: user?.is_patient
          ? appointment.doctor_details.specialization
          : appointment.patient_details.phone,
        reason: appointment.reason,
        status:
          appointment.status == "CANCELLED"
            ? "Cancelled"
            : getStatus(appointment.date, appointment.end_time),
      };
    });
  }

  function countAppointmentsWithStatus(status) {
    return appointments.filter((appointment) => appointment.status == status)
      .length;
  }

  function getStatus(date, time) {
    const endDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (endDateTime < now) {
      return "Past";
    } else {
      return "Upcoming";
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status == currentTab,
    );
  }, [appointments, currentTab]);

  return (
    <div className="bg-white rounded-md shadow-md px-8 pt-2 pb-8">
      <div className="text-lg text-red-900 font-bold mb-2">My schedules:</div>
      <div className="flex flex-row gap-2 mb-2">
        <div
          onClick={() => setCurrentTab("Upcoming")}
          className="rounded-md cursor-pointer px-4 py-2 shadow-md duration-200 hover:bg-red-800 hover:text-white"
          style={{
            backgroundColor: currentTab === "Upcoming" ? "#991b1b" : "#ffffff",
            color: currentTab === "Upcoming" ? "#ffffff" : "#991b1b",
          }}
        >
          {`Upcoming (${countAppointmentsWithStatus("Upcoming")})`}
        </div>

        <div
          onClick={() => setCurrentTab("Past")}
          className="rounded-md cursor-pointer px-4 py-2 shadow-md duration-200 hover:bg-red-800 hover:text-white"
          style={{
            backgroundColor: currentTab === "Past" ? "#991b1b" : "#ffffff",
            color: currentTab === "Past" ? "#ffffff" : "#991b1b",
          }}
        >
          {`Past (${countAppointmentsWithStatus("Past")})`}
        </div>

        <div
          onClick={() => setCurrentTab("Cancelled")}
          className="rounded-md cursor-pointer px-4 py-2 shadow-md duration-200 hover:bg-red-800 hover:text-white"
          style={{
            backgroundColor: currentTab === "Cancelled" ? "#991b1b" : "#ffffff",
            color: currentTab === "Cancelled" ? "#ffffff" : "#991b1b",
          }}
        >
          {`Cancelled (${countAppointmentsWithStatus("Cancelled")})`}
        </div>
      </div>
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-red-100 rounded-md">
            <thead className="bg-red-100 text-red-900">
              <tr>
                <th className="px-4 py-2 w-10">#</th>
                <th className="px-4 py-2 w-28">Date</th>
                <th className="px-4 py-2 w-24">Time</th>
                <th className="px-4 py-2 w-32">
                  <div className="max-w-[8rem] truncate">
                    {user?.is_patient ? "Doctor" : "Patient"}
                  </div>
                </th>
                <th className="px-4 py-2 w-40">
                  <div className="max-w-[10rem] truncate">
                    {user?.is_patient ? "Specialization" : "Contact"}
                  </div>
                </th>
                <th className="px-4 py-2 w-48">
                  <div className="max-w-[12rem] truncate">Reason</div>
                </th>
                <th className="px-4 py-2 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length == 0 && (
                <tr>
                  <td className="p-6 text-center" colSpan={7}>No data...</td>
                </tr>
              )}
              {filteredAppointments.map((appointment, index) => (
                <tr
                  key={appointment.id}
                  className="border-t hover:bg-red-50 transition-colors"
                >
                  <td className="px-4 py-2 font-bold text-red-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">{appointment.date}</td>
                  <td className="px-4 py-2">{appointment.time}</td>
                  <td className="px-4 py-2">
                    <div
                      className="max-w-[8rem] truncate"
                      title={appointment.user}
                    >
                      {appointment.user}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className="max-w-[10rem] truncate"
                      title={appointment.subText}
                    >
                      {appointment.subText}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className="max-w-[12rem] truncate"
                      title={appointment.reason}
                    >
                      {appointment.reason}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {currentTab == "Upcoming" ? (
                      <button
                        onClick={() => handleCancelClick(appointment.id)}
                        className="cursor-pointer border border-red-500 rounded-sm text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-red-900 italic">You have no appointments...</div>
      )}
      {isAlertShow && (
        <Alert
          title={"Cancel"}
          onCancel={handleAlertCancel}
          onOK={handleAlertOK}
          type={"danger"}
        >
          Cancellation is irreversible, are you sure you want to proceed?
        </Alert>
      )}
    </div>
  );
}
