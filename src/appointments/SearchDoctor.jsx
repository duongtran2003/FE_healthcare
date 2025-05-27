import { useState } from "react";
import SearchBox from "../shared/components/SearchBox";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { appointmentsApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useEffect } from "react";
import DoctorCard from "./components/DoctorCard";
import { useNavigate } from "react-router";

export default function SearchDoctor() {
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  async function handleOnSearch(value) {
    setLoading(true);
    try {
      const res = await appointmentsApi.searchDoctor(value);
      setDoctors(res);
    } catch (err) {
      toast.error("Something has gone wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleDoctorClick(id) {
    navigate(`/book-appointments/${id}`);
  }

  useEffect(() => {
    setLoading(true);
    appointmentsApi
      .searchDoctor("")
      .then((res) => {
        setDoctors(res);
      })
      .catch((err) => {
        // void
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="shadow-md rounded-sm">
        <SearchBox onSearch={handleOnSearch} />
      </div>
      <div className="mt-8 bg-white rounded-md shadow-md px-8 pb-8 pt-2">
        <div className="text-red-900 font-bold text-lg">Available doctors:</div>
        {doctors.length === 0 ? (
          <div className="italic">No available doctors...</div>
        ) : (
          <div className="flex flex-row flex-wrap gap-2">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctorInfo={doctor}
                onClick={handleDoctorClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
