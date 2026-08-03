import styles from "./MessageOverlay.module.css";

interface Props {
  message: string;
}

function MessageOverlay({ message }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.messageBox}>
        <div className={styles.icon}>⚠️</div>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
}

export default MessageOverlay;
