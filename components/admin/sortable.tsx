"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { type ReactNode, useId } from "react";

export type SortableLabels = { dragHandle: string; moveUp: string; moveDown: string };

type ItemControls = {
  /** Drag handle (also keyboard-sortable with Space + arrow keys). */
  handle: ReactNode;
  /** Up / down buttons, for touch screens and anyone who prefers buttons. */
  arrows: ReactNode;
  isDragging: boolean;
};

/**
 * A list (or grid) the client can reorder by dragging, or with the up/down
 * buttons. `onReorder` gets the items in their new order.
 */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  labels,
  layout = "list",
  className,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, controls: ItemControls) => ReactNode;
  labels: SortableLabels;
  layout?: "list" | "grid";
  className?: string;
}) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    onReorder(arrayMove(items, from, to));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    move(
      items.findIndex((i) => i.id === active.id),
      items.findIndex((i) => i.id === over.id),
    );
  };

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <ul className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {({ handleProps, isDragging }) =>
                renderItem(item, index, {
                  isDragging,
                  handle: (
                    <button
                      type="button"
                      {...handleProps}
                      aria-label={labels.dragHandle}
                      className="grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted hover:bg-floor-2 hover:text-ink active:cursor-grabbing"
                    >
                      <GripVertical className="size-5" aria-hidden />
                    </button>
                  ),
                  arrows: (
                    <span className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                        aria-label={labels.moveUp}
                        className="grid size-11 place-items-center rounded-md text-muted hover:bg-floor-2 hover:text-ink disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, index + 1)}
                        disabled={index === items.length - 1}
                        aria-label={labels.moveDown}
                        className="grid size-11 place-items-center rounded-md text-muted hover:bg-floor-2 hover:text-ink disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" aria-hidden />
                      </button>
                    </span>
                  ),
                })
              }
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: { handleProps: Record<string, unknown>; isDragging: boolean }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? "relative z-10" : undefined}
    >
      {children({ handleProps: { ref: setActivatorNodeRef, ...attributes, ...listeners }, isDragging })}
    </li>
  );
}
