import { useContext, useEffect } from "react";
import { iConferenceContext, ConferenceContext } from "../App";

export function Conference(props: any) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  useEffect(() => {
    console.log("HELO");
  }, []);

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        HELO
      </h2>
    </div>
  );
}
