import MenuOpen from "@mui/icons-material/MenuOpen";
// import More from "@mui/icons-material/MoreHorizRounded";
import More from "@mui/icons-material/MoreVertRounded";

const Header = () => {
  return (
    <div className="header opacity-90 fixed w-full top-0 h-16 pl-[1.2rem] pr-[1rem] flex items-center bg-slate-950">
      <div className="w-11/12 flex items-center">
        <MenuOpen sx={{ fontSize: "28px" }} />
        <span className="ml-4 text-lg font-bold">Твой фокус</span>
      </div>

      <More fontSize="medium" className="ml-auto" />
    </div>
  );
};

export default Header;
