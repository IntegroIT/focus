import React, { useRef, ReactNode, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import appState from "../../../store/Appstate.ts";
import StarFalse from "@mui/icons-material/StarBorderRounded";
import Priority from "@mui/icons-material/NearbyErrorOutlined";
import Idea from "@mui/icons-material/TipsAndUpdatesOutlined";
import Archive from "@mui/icons-material/ArchiveOutlined";
import Trash from "@mui/icons-material/DeleteOutlineOutlined";
// import DisLike from "@mui/icons-material/ThumbDownOutlined";
// import Down from "@mui/icons-material/VerticalAlignBottomOutlined";
import Down from "@mui/icons-material/GetAppOutlined";

interface DraggableBlockProps {
  children: ReactNode;
  isChild?: boolean;
  id: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = observer(
  ({ children, isChild = false, id }) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<boolean>(false);
    const startX = useRef<number>(0);
    const limit = 250; // Лимит для фиксации влево
    const bounceLimit = 100; // Лимит пружины при свайпе вправо
    const [lockedLeft, setLockedLeft] = useState(false); // Зафиксирован ли блок влево

    // Эффект для отслеживания изменений draggedBlockId
    useEffect(() => {
      if (
        appState.draggedBlockId &&
        appState.draggedBlockId !== id &&
        lockedLeft
      ) {
        // Если начали двигать другой блок, а текущий зафиксирован - сбрасываем его
        resetBlockPosition();
      }
    }, [appState.draggedBlockId, id, lockedLeft]);

    const startDragging = (clientX: number) => {
      isDragging.current = true;
      startX.current = clientX;
      blockRef.current!.style.transition = ""; // Отключаем плавность на время перетаскивания
      appState.setDraggedBlockId(id);

      // Если другой блок уже сдвинут, сбрасываем его
      if (appState.draggedBlockId && appState.draggedBlockId !== id) {
        const prevDraggedBlock = document.getElementById(
          appState.draggedBlockId
        );
        if (prevDraggedBlock) {
          prevDraggedBlock.style.transition = "transform 0.3s ease";
          prevDraggedBlock.style.transform = "translateX(0)";
        }
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isChild) e.stopPropagation();
      if (appState.draggedBlockId && appState.draggedBlockId !== id) return;
      startDragging(e.clientX);
      setupMouseListeners();
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (isChild) e.stopPropagation();
      if (appState.draggedBlockId && appState.draggedBlockId !== id) return;
      startDragging(e.touches[0].clientX);
      setupTouchListeners();
    };

    const handleMove = (clientX: number) => {
      if (!isDragging.current || !blockRef.current) return;

      const deltaX = clientX - startX.current;

      if (lockedLeft) {
        // Если блок зафиксирован влево, реагируем только на свайп вправо
        if (deltaX > 10) resetBlockPosition(); // Вернуть в исходное положение
        return;
      }

      let newPosition = Math.max(Math.min(deltaX, bounceLimit), -limit);

      if (newPosition <= -limit) {
        // Фиксация влево при достижении лимита
        setLockedLeft(true);
        blockRef.current.style.transform = `translateX(-${limit}px)`;
        blockRef.current.style.transition = "transform 0.3s ease";
      } else {
        // Следуем за курсором с пружинным эффектом при неполном сдвиге влево
        blockRef.current.style.transform = `translateX(${newPosition}px)`;
      }
    };

    const stopDragging = () => {
      isDragging.current = false;

      if (!blockRef.current) return;
      blockRef.current.style.transition = "transform 0.3s ease";

      const currentTranslateX = parseFloat(
        blockRef.current.style.transform
          .replace("translateX(", "")
          .replace("px)", "")
      );

      if (!lockedLeft) {
        // Пружинящий возврат вправо или влево, если лимит не достигнут
        if (currentTranslateX > 0 || currentTranslateX > -limit) {
          blockRef.current.style.transform = "translateX(0)";
        }
      }

      appState.setDraggedBlockId(null);
    };

    const resetBlockPosition = () => {
      if (!blockRef.current) return;
      blockRef.current.style.transition = "transform 0.3s ease";
      blockRef.current.style.transform = "translateX(0)";
      setLockedLeft(false);
      appState.setDraggedBlockId(null);
    };

    const setupMouseListeners = () => {
      const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const handleMouseUp = () => {
        stopDragging();
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const setupTouchListeners = () => {
      const handleTouchMove = (e: TouchEvent) =>
        handleMove(e.touches[0].clientX);
      const handleTouchEnd = () => {
        stopDragging();
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    };

    useEffect(() => {
      return () => stopDragging();
    }, []);

    return (
      <div style={{ position: "relative" }}>
        <div
          className="pt-2 flex-col"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: `${limit}px`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Trash fontSize="medium" />
          <Archive fontSize="medium" />
          <Down fontSize="medium" />
          <Priority fontSize="medium" />
          <Idea fontSize="medium" />
          <StarFalse fontSize="medium" />
        </div>
        <div
          ref={blockRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            width: "100%",
            // cursor:
            //   appState.draggedBlockId && appState.draggedBlockId !== id
            //     ? "default"
            //     : "grab",
            userSelect: "none",
            touchAction: "pan-y",
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default DraggableBlock;
