import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../layouts/stores/authStore";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useSpinnerStore } from "../shared/stores/spinnerStore";

export default function CreateSchedule() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const setLoading = useSpinnerStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!user || !user.is_doctor) {
      navigate("/dashboard");
    }
  }, [user]);

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    if (startTime && endTime && startTime < endTime) {
      clearErrors(["startTime", "endTime"]);
    } else {
      if (startTime) clearErrors("endTime");
      if (endTime) clearErrors("startTime");
    }
  }, [startTime, endTime]);

  const onSubmit = async (data) => {
    const { startTime, endTime } = data;

    if (startTime >= endTime) {
      setError("startTime", {
        type: "manual",
        message: "Start time must be before end time",
      });
      setError("endTime", {
        type: "manual",
        message: "End time must be after start time",
      });
      return;
    }

    console.log("Schedule submitted:", data);
    try {
      setLoading(true);
      const res = await appointmentsApi.createSchedule(data);
      toast.success("Created schedule successfully");
      reset();
    } catch (err) {
      toast.error("Something has gone wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFormReset = (e) => {
    e.preventDefault();
    reset();
  };

  return (
    <div className="w-fit mx-auto px-8 pt-2 pb-8 shadow-md rounded-md bg-white">
      <div className="font-bold text-red-900 mb-4 text-lg">
        Create Schedule
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-72 max-w-[700px] w-[700px] mx-auto space-y-2"
      >
        <div>
          <div className="text-sm mb-1">Select Date</div>
          <div
            className={
              "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
              (errors.date ? " !bg-red-500/10" : "")
            }
          >
            <CalendarTodayIcon className="text-gray-400" fontSize="small" />
            <input
              type="date"
              min={today}
              {...register("date", { required: "Date is required" })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs pl-4 mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-sm mb-1">Start Time</div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.startTime ? " !bg-red-500/10" : "")
              }
            >
              <AccessTimeIcon className="text-gray-400" fontSize="small" />
              <input
                type="time"
                {...register("startTime", {
                  required: "Start time is required",
                })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.startTime && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm mb-1">End Time</div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.endTime ? " !bg-red-500/10" : "")
              }
            >
              <AccessTimeIcon className="text-gray-400" fontSize="small" />
              <input
                type="time"
                {...register("endTime", { required: "End time is required" })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.endTime && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm mb-1">Appointment Duration</div>
          <div
            className={
              "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
              (errors.duration ? " !bg-red-500/10" : "")
            }
          >
            <TimerIcon className="text-gray-400" fontSize="small" />
            <select
              {...register("duration", {
                required: "Duration is required",
                valueAsNumber: true,
              })}
              className="outline-none text-sm bg-transparent w-full"
            >
              <option value="">Select duration</option>
              <option value={30}>30 mins</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          {errors.duration && (
            <p className="text-red-500 text-xs pl-4 mt-1">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-end gap-3">
          <button
            disabled={!isDirty}
            type="submit"
            className="w-fit px-16 font-bold uppercase mt-8 bg-red-700 text-white/90 py-2 rounded-full hover:bg-red-800 duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
          >
            Submit
          </button>
          <button
            onClick={handleFormReset}
            disabled={!isDirty}
            className="px-16 w-fit font-bold uppercase mt-8 bg-gray-500 text-white/90 py-2 rounded-full hover:bg-gray-600 duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
