import styles from './dottedSection.module.css';

export default function CustomBackgroundDiv() {
  return (
    <div className={styles.backgroundBox}>
      <h2 style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        Dotted Animated Background
      </h2>
    </div>
  );
}
