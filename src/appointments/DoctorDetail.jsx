import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { useEffect, useMemo, useState } from "react";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import Tag from "../shared/components/Tag";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const [scheduleInfo, setScheduleInfo] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);

  function handleSelectSchedule(schedule) {
    if (currentSchedule?.id == schedule.id) {
      setCurrentSchedule(null);
      setCurrentSlot(null);
      return;
    }

    setCurrentSchedule(schedule);
  }

  function handleSlotClick(slot) {
    if (!currentSchedule) {
      return;
    }

    if (currentSlot == slot) {
      setCurrentSlot(null);
      return;
    }

    setCurrentSlot(slot);
  }

  const calculatedTimeSlots = useMemo(() => {
    if (!currentSchedule) {
      return null;
    }

    const slots = [];

    const [year, month, day] = currentSchedule.date.split("-").map(Number);
    const [startH, startM, startS] = currentSchedule.start_time
      .split(":")
      .map(Number);
    const [endH, endM, endS] = currentSchedule.end_time.split(":").map(Number);

    const start = new Date(year, month - 1, day, startH, startM, startS);
    const end = new Date(year, month - 1, day, endH, endM, endS);

    let current = new Date(start);

    while (
      current.getTime() + currentSchedule.slot_duration * 60 * 1000 <=
      end.getTime()
    ) {
      const hours = current.getHours().toString().padStart(2, "0");
      const minutes = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);

      current = new Date(
        current.getTime() + currentSchedule.slot_duration * 60 * 1000,
      );
    }

    return slots;
  }, [currentSchedule]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      appointmentsApi.searchDoctor(""),
      appointmentsApi.getDoctorSchedules(id),
    ])
      .then(([doctorsRes, schedulesRes]) => {
        const doctor = doctorsRes.find((doctor) => doctor.id == id);
        if (!doctor) {
          toast.error("Doctor not found");
          navigate("/book-appointments");
          return;
        }

        console.log("it got here");

        setDoctorInfo(doctor);
        setScheduleInfo(schedulesRes);
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
        navigate("/book-appointments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <ArrowBackIcon
        className="cursor-pointer"
        onClick={() => navigate("/book-appointments")}
      />
      <div className="bg-white rounded-md shadow-md px-8 pb-8 pt-2 mt-4">
        <div className="text-lg text-red-900 font-bold">
          Dr. {doctorInfo?.user?.first_name} {doctorInfo?.user?.last_name}
          <div className="italic font-normal text-sm text-black">
            {doctorInfo?.specialization}
          </div>
        </div>
        <div className="text-lg text-red-900 font-bold mt-2">
          Book an appointment:
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          <div className="border border-black rounded-sm overflow-clip flex-1">
            <div className="bg-gray-100 px-2 py-1 border-b">
              Available dates:
            </div>
            <div className="px-3 py-3">
              {scheduleInfo.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {scheduleInfo
                    .filter((schedule) => schedule.is_available)
                    .map((schedule) => (
                      <div
                        onClick={() => handleSelectSchedule(schedule)}
                        className="p-2 rounded-md shadow-md flex flex-row items-center cursor-pointer duration-100"
                        style={{
                          backgroundColor:
                            currentSchedule?.id == schedule.id
                              ? "#991b1b"
                              : "#fee2e2",
                          color:
                            currentSchedule?.id == schedule.id
                              ? "#ffffff"
                              : "inherit",
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-bold">{schedule.date}</div>
                          <div className="italic">
                            {schedule.start_time} - {schedule.end_time}
                          </div>
                        </div>
                        <Tag
                          type={"success"}
                          text={`${schedule.slot_duration} minutes`}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div>This doctor has no schedules...</div>
              )}
            </div>
          </div>
          <div className="border border-black rounded-sm overflow-clip flex-1">
            <div className="bg-gray-100 px-2 py-1 border-b">Time slots:</div>
            {currentSchedule ? (
              <div className="p-3 flex flex-row gap-2 flex-wrap">
                {calculatedTimeSlots.map((slot) => (
                  <div
                    style={{
                      backgroundColor:
                        slot == currentSlot ? "#991b1b" : "#fee2e2",
                      color: slot == currentSlot ? "#ffffff" : "inherit",
                    }}
                    className="bg-red-100 rounded-sm px-2 py-1 cursor-pointer"
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <div className="italic p-3">Please select a date...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
