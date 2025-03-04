import React, { useRef, ReactNode, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import appState from "../../../store/Appstate.ts";
import StarFalse from "@mui/icons-material/StarBorderRounded";

interface DraggableBlockProps {
  children: ReactNode;
  isChild?: boolean;
  id: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = observer(
  ({ children, isChild = false, id }) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<boolean>(false);
    const offsetX = useRef<number>(0);
    const startY = useRef<number>(0);
    const startX = useRef<number>(0);
    const limit = 80;
    const [lockedLeft, setLockedLeft] = useState(false);

    const startDragging = (clientX: number, clientY: number) => {
      if (!blockRef.current) return;

      isDragging.current = true;
      const rect = blockRef.current.getBoundingClientRect();
      offsetX.current = clientX - rect.left;
      startY.current = clientY;
      startX.current = clientX;
      appState.setDraggedBlockId(id);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isChild) e.stopPropagation();
      if (appState.draggedBlockId && appState.draggedBlockId !== id) return;
      startDragging(e.clientX, e.clientY);
      setupMouseListeners();
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (isChild) e.stopPropagation();
      if (appState.draggedBlockId && appState.draggedBlockId !== id) return;
      startDragging(e.touches[0].clientX, e.touches[0].clientY);
      setupTouchListeners();
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging.current || !blockRef.current) return;

      const deltaY = Math.abs(clientY - startY.current);
      const deltaX = Math.abs(clientX - startX.current);

      if (deltaY > deltaX * 2) return; // Игнорируем вертикальные движения

      const newPosition = clientX - offsetX.current;
      let clampedPosition = Math.max(Math.min(newPosition, limit), -limit);

      // Если достигли предела слева, фиксируем
      if (clampedPosition === -limit) {
        setLockedLeft(true);
      }

      // Если двигаем вправо после фиксации, моментально сбрасываем на 0
      if (lockedLeft && newPosition > -limit + 10) {
        blockRef.current.style.transition = "transform 0.3s ease";
        blockRef.current.style.transform = "translateX(0)";
        setLockedLeft(false);
        return;
      }

      // Если блок зафиксирован влево, не обновляем transform
      if (lockedLeft && clampedPosition < -limit) return;

      blockRef.current.style.transform = `translateX(${clampedPosition}px)`;
    };

    const stopDragging = () => {
      isDragging.current = false;

      if (blockRef.current && !lockedLeft) {
        blockRef.current.style.transition = "transform 0.3s ease";
        blockRef.current.style.transform = "translateX(0)";
        appState.setDraggedBlockId(null);
      }
    };

    const setupMouseListeners = () => {
      const handleMouseMove = (e: MouseEvent) =>
        handleMove(e.clientX, e.clientY);
      const handleMouseUp = () => {
        stopDragging();
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const setupTouchListeners = () => {
      const handleTouchMove = (e: TouchEvent) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      };

      const handleTouchEnd = () => {
        stopDragging();
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    };

    useEffect(() => {
      return () => {
        stopDragging();
      };
    }, []);

    return (
      <div style={{ position: "relative" }}>
        <div
          className="pt-2 flex-col"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${limit}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StarFalse fontSize="medium" />
        </div>
        <div
          ref={blockRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            width: "100%",
            cursor:
              appState.draggedBlockId && appState.draggedBlockId !== id
                ? "default"
                : "grab",
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
