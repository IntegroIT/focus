import { observer } from "mobx-react-lite";
import { useObserver } from "mobx-react-lite";
import appState from "../../../store/Appstate";

const TimeSelector = observer(() => {
  return useObserver(() => (
    <div className="timeSelector mt-6">
      <span className="mr-2">Время начала</span>
      <input
        onChange={(e) => appState.setTaskData("startTime", e.target.value)}
        type="time"
        className="w-20 h-5 mt-0 ml-2 border-slate-100 border-2 rounded"
      />
      {/* <input type="number" /> */}
    </div>
  ));
});

export default TimeSelector;
