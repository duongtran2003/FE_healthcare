export default function Tag({ type, text }) {
  return <>
    { type === 'success' && <div className="bg-green-700 h-fit w-fit px-2 py-1 text-white rounded-md">{text}</div> }
    { type === 'error' && <div className="bg-red-700 h-fit w-fit px-2 py-1 text-white rounded-md">{text}</div> }
    { type === 'warning' && <div className="bg-yellow-700 h-fit w-fit px-2 py-1 text-white rounded-md">{text}</div> }
  </>
}
