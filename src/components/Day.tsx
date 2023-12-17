import { useState } from "react";

type Activity = {
  startTime: number;
  endTime: number;
  name: string;
  id: string;
};
const stepSize: number = 15; // Set your desired step size
type HandleType = "upperhandle" | "lowerhandle";
const dayStartTime = 1000;
const dayEndTime = 1000;

function Day() {
  const [activities, setActivities] = useState<Activity[]>([
    { name: "activity 1", endTime: 1200, startTime: 1150, id: "12" },
  ]);
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    currentActivity: Activity,
    handleType: HandleType
  ) => {
    const initialY = event.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - initialY;
      if (Math.abs(deltaY) < stepSize) return;

      const roundedDelta = Math.round(deltaY / stepSize) * stepSize;
      const updateCurrentActivity = { ...currentActivity };

      if (handleType === "upperhandle") {
        updateCurrentActivity.startTime =
          updateCurrentActivity.startTime + roundedDelta;
      } else {
        updateCurrentActivity.endTime =
          updateCurrentActivity.endTime + roundedDelta;
      }
      console.log(
        "endtime:",
        updateCurrentActivity.endTime,
        "roundedDelta",
        roundedDelta
      );
      //update state
      const updatedActivityData = activities.map((a) => {
        if (a.id !== currentActivity.id) return a;
        return updateCurrentActivity;
      });
      setActivities(updatedActivityData);
    };
    // check if valid
    // set state if valid
    // try saving state while checking
    // if empty space found then valid is true
    // up down for handles will change start time and end time
    // will need to keep updating state while dragingg

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <div className="h-screen">
      {activities?.map((a) => (
        <div
          style={{
            position: "relative",
            top: a.startTime - dayStartTime,
            height: a.endTime - a.startTime,
            lineHeight: 1,
          }}
          key={a.id}
          className="bg-red-600"
        >
          <div
            className="resize"
            onMouseDown={(e) => handleMouseDown(e, a, "upperhandle")}
          >
            ---
          </div>
          {a.name}
          <div
            style={{ lineHeight: 1, bottom: 0 }}
            className="absolute leading-none resize"
            onMouseDown={(e) => handleMouseDown(e, a, "lowerhandle")}
          >
            ---
          </div>
        </div>
      ))}
    </div>
  );
}

export default Day;
