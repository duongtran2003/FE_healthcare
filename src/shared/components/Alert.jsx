export default function Alert({ title, onOK, onCancel, type, children }) {
  return (
    <div
      className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black/25"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-sm shadow-md min-w-[30vw] min-h-[25vh] w-fit h-fit overflow-clip flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "danger" && <div className="h-1 bg-red-500"></div>}
        {type === "info" && <div className="h-1 bg-blue-900"></div>}
        <div className="px-6 py-2 text-lg font-bold bg-gray-200">{title}</div>
        <div className="flex-1 p-4">{children}</div>
        <div className="flex flex-row justify-end gap-2 p-4">
          <button onClick={onOK} className="bg-green-700 hover:bg-green-800 duration-200 rounded-sm px-4 py-1 cursor-pointer text-white">
            OK
          </button>
          <button onClick={onCancel} className="bg-white text-red-500 cursor-pointer px-4 py-1 rounded-sm border border-red-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
