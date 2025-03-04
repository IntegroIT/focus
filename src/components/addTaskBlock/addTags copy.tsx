// import appState from "../../../store/Appstate.ts";
// import { useState } from "react";
// import Done from "@mui/icons-material/DoneRounded";

// const AddTags = () => {
//   const [tags, setTags] = useState<string[]>([]); // массив выбранных тегов
//   const handleClick = (tag: string) => {
//     // const tags = choisedTags;
//     if (tags.includes(tag)) {
//       const index = tags.indexOf(tag);
//       tags.splice(index, 1);
//     }
//     if (!tags.includes(tag)) {
//       tags.push(tag); // добавляем тег в массив
//     }
//     setTags(tags); // меняем массив выбранных тегов
//     alert(JSON.stringify(tags));
//     appState.setTaskData("tags", tags); // сохраняем в массиве тегов
//   };

//   const isClicked = (tag: string) => {
//     return tags.includes(tag);
//   }; // проверка на выбран ли тегиз массива

//   // appState.setTaskData("tags", [...appState.taskData.tags, tag]);
//   // const [tagIsClicked, setTagIsClicked] = useState(-1);
//   return (
//     <div className="addTags">
//       <span className="mr-2">Теги</span>
//       <input
//         onChange={(e) => appState.setTaskData("tags", e.target.value)}
//         type="text"
//         className="w-20 h-5 mt-0 ml-2 border-slate-100 border-2 rounded"
//       />
//       {appState.tags.map((tag, index) => (
//         <div
//           onClick={() => handleClick(tag)}
//           style={{
//             backgroundColor: isClicked(tag) ? "rgba(0, 0, 0, 0.5)" : "",
//           }}
//           className="flex items-center justify-between"
//           key={`#${tag}`}
//         >
//           <div>
//             {tag} {index}
//           </div>
//           <div className="inputCheckbox flex justify-center items-center min-w-[23px] h-[23px] w-[23px] rounded-md mr-2 border-slate-400 border-[2px]">
//             {isClicked(tag) && <Done fontSize="small" />}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AddTags;
