"use client";
import styles from "./nav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Chat", href: "/chat" },
  { label: "Mapping", href: "/mapping" },
  { label: "Courses", href: "/courses" },
  { label: "How to Use", href: "/help" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className={styles.header}>
      
      <div className={styles.logo}>
    <img src="/assets/book.png" alt="Logo" className={styles.logoImage} />
    <span className={styles.logoText}>Mapping Assistant</span>
  </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles["nav-link"]} ${
              pathname === item.href ? styles.active : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
