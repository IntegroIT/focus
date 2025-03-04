import { observer } from "mobx-react-lite";
import { useObserver } from "mobx-react-lite";

const TimeSelector = observer(() => {
  return useObserver(() => (
    <div className="timeSelector">
      <input type="number" />
      <input type="number" />
    </div>
  ));
});

export default TimeSelector;
