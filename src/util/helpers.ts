type Activity = {
  startTime: number;
  endTime: number;
  name: string;
  id: string;
};
type HandleType = "upperhandle" | "lowerhandle";
const dayStartTime = 1000;
const dayEndTime = 1800;

export const getTime = (num: number) => {
  const minutePart = num % 100;
  const convertedMinutes = (minutePart / 100) * 60;
  return num - minutePart + convertedMinutes;
};

export const checkIfResizeIsValid = ({
  activities,
  currentActivity,
  handleType,
  roundedDelta,
  activitiesAtMouseDown,
}: {
  activities: Activity[];
  activitiesAtMouseDown: Activity[];
  currentActivity: Activity;
  handleType: HandleType;
  roundedDelta: number;
}) => {
  //[TODO] take empty space in account
  //[TODO] cannot make event smaller than stepsize
  const currentActivityIndex = activities.findIndex(
    ({ id }) => id === currentActivity.id
  );
  const newActivityData = [...activities];
  const multiplier = handleType === "lowerhandle" ? +1 : -1;
  console.log(activities[0].endTime, "received in validator");

  // debugger;
  for (
    let idx = currentActivityIndex;
    idx < activities.length && idx > -1;
    idx = idx + multiplier
  ) {
    if (handleType === "upperhandle") {
      newActivityData[idx].startTime =
        activitiesAtMouseDown[idx].startTime + roundedDelta;
      if (idx !== currentActivityIndex) {
        newActivityData[idx].endTime =
          activitiesAtMouseDown[idx].endTime + roundedDelta;
      }
      if (
        (idx !== 0 &&
          newActivityData[idx - 1].endTime < newActivityData[idx].startTime) ||
        (idx === 0 && newActivityData[idx].startTime >= dayStartTime)
      ) {
        return { valid: true, newActivityData };
      }
      if (idx === 0 && newActivityData[idx].startTime < dayStartTime) {
        return { valid: false };
      }
      if (idx === 0 && newActivityData[idx].startTime >= dayStartTime) {
        return { valid: true, newActivityData };
      }
    } else {
      console.log(activitiesAtMouseDown[idx].endTime, "else", roundedDelta);
      newActivityData[idx].endTime =
        activitiesAtMouseDown[idx].endTime + roundedDelta;
      console.log(activitiesAtMouseDown[idx].endTime, "else");
      if (idx !== currentActivityIndex) {
        newActivityData[idx].startTime =
          activitiesAtMouseDown[idx].startTime + roundedDelta;
      }
      if (
        (idx !== newActivityData.length - 1 &&
          newActivityData[idx + 1].startTime >= newActivityData[idx].endTime) ||
        (idx === newActivityData.length - 1 &&
          newActivityData[idx].endTime <= dayEndTime)
      ) {
        return { valid: true, newActivityData };
      }
      if (
        idx === newActivityData.length - 1 &&
        newActivityData[idx].endTime > dayEndTime
      ) {
        return { valid: false };
      }
      if (
        idx === newActivityData.length - 1 &&
        newActivityData[idx].endTime <= dayEndTime
      ) {
        return { valid: true, newActivityData };
      }
      console.log("next loop");
    }
  }
  return { valid: false };
};
