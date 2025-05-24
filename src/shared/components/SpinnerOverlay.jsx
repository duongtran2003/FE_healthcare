import { useSpinnerStore } from "../stores/spinnerStore";
import { PacmanLoader } from "react-spinners";

export default function SpinnerOverlay() {
  const loading = useSpinnerStore((state) => state.loading);

  return (
    <>
      {loading && (
        <div className="fixed w-[100vw] h-[100vh] bg-black/20 flex justify-center items-center top-0 left-0">
          <PacmanLoader color="#E7000B" />
        </div>
      )}
    </>
  );
}
