import styles from "./MessageOverlay.module.css";

interface Props {
  message: string;
}

function MessageOverlay({ message }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.messageBox}>
        {message}
      </div>
    </div>
  );
}

export default MessageOverlay;
