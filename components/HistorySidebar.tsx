"use client";
import React, { useState } from "react";
import styles from "./HistorySidebar.module.css";

type HistorySidebarProps = {
  title: string;
  items: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
};

export default function HistorySidebar({
  title,
  items,
  activeId,
  onSelect,
  onDelete,
  onAdd,
}: HistorySidebarProps) {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`${styles.sidebar} ${!open ? styles.sidebarCollapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        <h3>{open ? title : ""}</h3>
        <button className={styles.toggleSidebarButton} onClick={() => setOpen(!open)}>
          <i className="fi fi-rr-angle-small-left"></i>
        </button>
      </div>

      {open && (
        <>
          <ul className={styles.sessionList}>
            {items.map((item) => (
              <li
                key={item.id}
                className={`${styles.sessionItem} ${item.id === activeId ? styles.activeSession : ""}`}
              >
                <span className={styles.sessionName} onClick={() => onSelect(item.id)}>
                  {item.name}
                </span>
                <button className={styles.deleteButton} onClick={() => onDelete(item.id)}>
                  <i className="fi fi-rr-trash"></i>
                </button>
              </li>
            ))}
          </ul>

          <button onClick={onAdd} className={styles.newSessionButton}>
            ➕ New
          </button>
        </>
      )}
    </aside>
  );
}
