import MenuOpen from "@mui/icons-material/MenuOpen";
// import More from "@mui/icons-material/MoreHorizRounded";
import More from "@mui/icons-material/MoreVertRounded";
import Search from "@mui/icons-material/SearchOutlined";

const Header = () => {
  return (
    <div className="header opacity-90 fixed w-full top-0 h-16 pl-[1.2rem] pr-[1rem] flex items-center bg-slate-950">
      <div className="w-11/12 flex items-end">
        <MenuOpen fontSize="medium" />
        <span className="ml-4 text-md font-bold">Твой фокус</span>
      </div>
      <Search fontSize="medium" className="ml-auto cursor-pointer" />
      <More fontSize="medium" className="ml-4 cursor-pointer" />
    </div>
  );
};

export default Header;
