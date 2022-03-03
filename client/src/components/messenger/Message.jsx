
import { UserCircleIcon } from "@heroicons/react/solid";
import { useEffect, useRef } from "react";
import {format} from "timeago.js";

export default function Message({last, own, messages, empty}) {
  const scrollref = useRef()
  useEffect(() => {
    last && (window.location.href = `#${last._id}`)
  },[scrollref?.current])
  // console.log(scrollref?.current)
  return (
    <div className="p-1">
      <div className={`${!empty && "hidden"}`}>
        <p className="text-center bg-gray-500 text-white p-2 rounded-sm mt-5">Start sending messages instantly</p>
      </div>
      <div className={`${empty && "hidden"} flex items-start ${own && "justify-end"}`}>
          {!own && <UserCircleIcon className="h-7 text-gray-400" />}
          <div id={messages?._id} className={`rounded-lg w-fit max-w-[80%] ${own ? "bg-gray-700" : "bg-gray-100"}`}>
              <p className={`py-2 px-5  ${own ? " text-white" : "text-gray-500"}`}>{messages?.text}</p>
              <p className={`text-[8px] pb-2 text-right px-2 ${own ? "text-white opacity-50" : "text-gray-500 opacity-60"} `}>{format(messages?.createdAt)}</p>
          </div>
      </div>
    </div>
  )
}
