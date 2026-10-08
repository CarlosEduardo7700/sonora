type ProgressBarProps = {
  value: number;
  label?: string;
};

const styles = {
  container: "flex flex-col gap-1",
  labelContainer: "flex items-center justify-between text-xs text-muted-foreground",
  barContainer: "h-2 w-full overflow-hidden rounded-full bg-muted",
  bar: "h-full rounded-full bg-primary transition-all",
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.container}>

      {label && (
        <div className={styles.labelContainer}>
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}

      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          style={{ width: `${clamped}%` }}
        />
      </div>
      
    </div>
  );
}
