import { useRef, useState } from "react";
import { checkIfResizeIsValid, getTime } from "../util/helpers";

type Activity = {
  startTime: number;
  endTime: number;
  name: string;
  id: string;
};
const stepSize: number = 25;
type HandleType = "upperhandle" | "lowerhandle";
const dayStartTime = 1000;
const hours = 8;

const generateNumberArray = (start: number, step: number, count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(start + i * step);
  }
  return result;
};

const rails = generateNumberArray(dayStartTime, 100, hours);

function Day() {
  const [activities, setActivities] = useState<Activity[]>([
    { name: "activ", endTime: 1200, startTime: 1150, id: "12" },
    { name: "act", endTime: 1300, startTime: 1250, id: "13" },
    { name: "acv", endTime: 1450, startTime: 1400, id: "14" },
  ]);
  const activitiesAtMouseDown = useRef<Activity[] | null>(null);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    currentActivity: Activity,
    handleType: HandleType,
    activitiesFromDOM: Activity[],
  ) => {
    const initialY = event.clientY;
    activitiesAtMouseDown.current = structuredClone(activitiesFromDOM);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - initialY;
      const roundedDelta = Math.round(delta / stepSize) * stepSize;
      // if (Math.abs(delta) < stepSize){
      //   console.log("delta too small");return;
      // }

      const result = checkIfResizeIsValid({
        activities: [...activitiesFromDOM],
        currentActivity,
        handleType,
        roundedDelta,
        activitiesAtMouseDown:
          activitiesAtMouseDown.current || activitiesFromDOM,
      });

      if (result.valid) {
        setActivities(result.newActivityData!);
      }
    };

    const handleMouseUp = () => {
      activitiesAtMouseDown.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative h-screen select-none">
      {activities?.map((a) => (
        <div
          style={{
            // fontSize: 13,
            top: a.startTime - dayStartTime,
            height: a.endTime - a.startTime,
            lineHeight: 0.9,
          }}
          key={a.id}
          className="w-80 z-10 text-xs bg-blue-200 border-blue-700 absolute text-black border-4 rounded-md p-1"
        >
          <div
            className="absolute resize -top-2 left-1/2 transform -translate-x-1/2"
            onMouseDown={(e) =>
              handleMouseDown(e, a, "upperhandle", activities)
            }
          >
            ---
          </div>
          <div className="flex flex-grow justify-between">
            <span className="font-semibold">{a.name}</span>
            <span>{getTime(a.startTime)}</span>
          </div>
          {/* {getTime(a.endTime)} */}
          <div
            style={{ lineHeight: 1 }}
            className="absolute resize -bottom-2 left-1/2 transform -translate-x-1/2"
            onMouseDown={(e) =>
              handleMouseDown(e, a, "lowerhandle", activities)
            }
          >
            ---
          </div>
        </div>
      ))}
      {rails.map((r) => (
        <>
          <div
            style={{
              position: "absolute",
              top: r - dayStartTime,
            }}
            key={r}
            className="w-96 bg-gray-700 h-1 -left-16 text-black "
          />
          <div
            style={{
              position: "absolute",
              top: r - dayStartTime,
            }}
            key={`${r}-time`}
            className=" -left-16 text-gray-500 "
          >
            {r}
          </div>
        </>
      ))}
    </div>
  );
}

export default Day;
