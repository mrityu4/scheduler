import { useRef, useState } from "react";
import { checkIfResizeIsValid, getTime } from "../util/helpers";

type Activity = {
  startTime: number;
  endTime: number;
  name: string;
  id: string;
};
const stepSize: number = 25; // Set your desired step size
type HandleType = "upperhandle" | "lowerhandle";
const dayStartTime = 1000;

function Day() {
  const [activities, setActivities] = useState<Activity[]>([
    { name: "activ", endTime: 1200, startTime: 1150, id: "12" },
    { name: "act", endTime: 1300, startTime: 1250, id: "13" },
  ]);
  const activitiesAtMouseDown = useRef<Activity[] | null>(null);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    currentActivity: Activity,
    handleType: HandleType,
    activitiesFromDOM: Activity[]
  ) => {
    const initialY = event.clientY;
    activitiesAtMouseDown.current = structuredClone(activitiesFromDOM);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - initialY;
      const roundedDelta = Math.round(delta / stepSize) * stepSize;
      if (Math.abs(delta) < stepSize) return;

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
    <div className="h-screen select-none">
      {activities?.map((a) => (
        <div
          style={{
            position: "absolute",
            top: a.startTime - dayStartTime,
            height: a.endTime - a.startTime,
            lineHeight: 1,
          }}
          key={a.id}
          className="bg-red-600"
        >
          <div
            className="resize"
            onMouseDown={(e) =>
              handleMouseDown(e, a, "upperhandle", activities)
            }
          >
            ---
          </div>
          {getTime(a.startTime)}
          {a.name}
          {getTime(a.endTime)}
          <div
            style={{ lineHeight: 1, bottom: 0 }}
            className="absolute leading-none resize"
            onMouseDown={(e) =>
              handleMouseDown(e, a, "lowerhandle", activities)
            }
          >
            ---
          </div>
        </div>
      ))}
    </div>
  );
}

export default Day;
