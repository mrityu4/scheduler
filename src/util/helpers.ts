type Activity = {
  startTime: number;
  endTime: number;
  name: string;
  id: string;
};
type HandleType = "upperhandle" | "lowerhandle";
const dayStartTime = 1000;
const dayEndTime = 1800;

const stepSize: number = 25; // Set your desired step size
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
}): { valid: false } | { valid: true; newActivityData: Activity[] } => {
  //[TODO] take empty space in account
  const currentActivityIndex = activities.findIndex(
    ({ id }) => id === currentActivity.id,
  );
  const newActivityData = [...activities];
  const multiplier = handleType === "lowerhandle" ? +1 : -1;

  // cannot make event smaller than stepsize
  if (handleType === "lowerhandle" && roundedDelta < 0) {
    const duration = currentActivity.endTime - currentActivity.startTime;
    if (duration - stepSize < Math.abs(roundedDelta)) {
      return { valid: false };
    }
  }
  let updatedDelta = roundedDelta;
  // if (roundedDelta === 0) {
  //   return { valid: false };
  // }

  for (
    let idx = currentActivityIndex;
    idx < activities.length && idx > -1;
    idx = idx + multiplier
  ) {
    if (handleType === "upperhandle") {
      //upperhandle so startTime will be modified  of all activities
      newActivityData[idx].startTime =
        activitiesAtMouseDown[idx].startTime + updatedDelta;

      if (idx !== currentActivityIndex) {
        //it means currnt activity is being pushed by another activity from bottom
        newActivityData[idx].endTime =
          activitiesAtMouseDown[idx].endTime + updatedDelta;
      }

      //invalid change happened
      if (newActivityData[idx].endTime <= newActivityData[idx].startTime) {
        return { valid: false };
      }

      //space available from free time, no need to resize next activity
      if (
        (idx !== 0 &&
          newActivityData[idx - 1].endTime < newActivityData[idx].startTime) ||
        (idx === 0 && newActivityData[idx].startTime >= dayStartTime)
      ) {
        return { valid: true, newActivityData };
      }

      //interaction will move activiy before dayStartTime so returning as invalid
      if (idx === 0 && newActivityData[idx].startTime < dayStartTime) {
        return { valid: false };
      }

      //applied changes to last activity
      if (idx === 0 && newActivityData[idx].startTime >= dayStartTime) {
        return { valid: true, newActivityData };
      }
    } else {
      // debugger;
      //lowerhandle
      console.log({ roundedDelta, updatedDelta });
      console.table(newActivityData);
      //lowerhandle so endtime will be modified  of all activities
      newActivityData[idx].endTime =
        activitiesAtMouseDown[idx].endTime + updatedDelta;

      //lowerhandle so startTime will be modified for non current activity
      if (idx !== currentActivityIndex) {
        newActivityData[idx].startTime =
          activitiesAtMouseDown[idx].startTime + updatedDelta;
      }

      //invalid change happened
      if (newActivityData[idx].endTime <= newActivityData[idx].startTime) {
        return { valid: false };
      }
      // console.log({ updatedDelta })
      //space available from free time, no need to resize next activity
      if (
        (idx !== newActivityData.length - 1 &&
          newActivityData[idx + 1].startTime >= newActivityData[idx].endTime) ||
        (idx === newActivityData.length - 1 &&
          newActivityData[idx].endTime <= dayEndTime)
      ) {
        console.log("return");
        return { valid: true, newActivityData };
      }
      //interaction will move activiy beyond dayEndTime so returning as invalid
      if (
        idx === newActivityData.length - 1 &&
        newActivityData[idx].endTime > dayEndTime
      ) {
        return { valid: false };
      }

      //applied changes to last activity
      if (
        idx === newActivityData.length - 1 &&
        newActivityData[idx].endTime <= dayEndTime
      ) {
        console.log("return");
        return { valid: true, newActivityData };
      }

      console.log("next loop");
      if (updatedDelta > 0) {
        // we are expanding the activity
        if (idx !== newActivityData.length - 1) {
          console.table(activities);
          const freeTimeOffset =
            activitiesAtMouseDown[idx + 1].startTime -
            activitiesAtMouseDown[idx].endTime;
          console.log(freeTimeOffset);
          updatedDelta = updatedDelta - freeTimeOffset;
        }
      }
    } //else
    console.log("loop");
  } //for
  return { valid: false };
};
