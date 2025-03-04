import Home from "@mui/icons-material/HomeRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import Workspaces from "@mui/icons-material/WorkspacesRounded";
import FocusIcon from "@mui/icons-material/FilterCenterFocusRounded";
import Stats from "@mui/icons-material/StackedLineChartRounded";
import Habbits from "@mui/icons-material/ViewTimelineRounded";
import Calendar from "@mui/icons-material/CalendarMonthRounded";

const Menu = () => {
  return (
    <div className="flex flex-rowl pr-5 pl-5 justify-between h-14 items-center gap-4 fixed bottom-0 w-full bg-slate-950">
      <Home fontSize="medium" />
      <Workspaces fontSize="medium" />
      <FeedRoundedIcon fontSize="medium" />
      <FocusIcon fontSize="large" />
      <Calendar fontSize="medium" />
      <Habbits fontSize="medium" />
      <Stats fontSize="medium" />
    </div>
  );
};

export default Menu;
