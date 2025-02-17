import Link from "next/link";
import styles from "./styles/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.text}>Page Not Found</p>
      <Link href="/" className={styles.link}>
        Go back home
      </Link>
    </div>
  );
}
