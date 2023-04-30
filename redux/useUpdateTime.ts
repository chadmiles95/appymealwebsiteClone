import { useDispatch } from "react-redux";
import { updateCurrentTime } from "./shoppersSlice";

const useUpdateTime = () => {
  const dispatch = useDispatch();

  const updateTime = () => {
    const currentTime = new Date();

    // Convert the current time to Eastern Standard Time
    const easternTime = new Date(
      currentTime.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const militaryTime =
      easternTime.getHours().toString().padStart(2, "0") +
      easternTime.getMinutes().toString().padStart(2, "0");
    dispatch(updateCurrentTime({ currentTime: easternTime, militaryTime }));
  };

  return updateTime;
};

export default useUpdateTime;
