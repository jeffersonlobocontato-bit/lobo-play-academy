import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  variant?: "default" | "compact" | "large";
  showLabels?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({
  targetDate,
  onExpire,
  variant = "default",
  showLabels = true,
  className = "",
}: CountdownTimerProps) => {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onExpire]);

  if (!timeLeft) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-destructive font-semibold">Tempo esgotado!</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const timeUnits = [
    { value: timeLeft.days, label: "Dias", show: timeLeft.days > 0 },
    { value: timeLeft.hours, label: "Horas", show: true },
    { value: timeLeft.minutes, label: "Min", show: true },
    { value: timeLeft.seconds, label: "Seg", show: true },
  ];

  const sizeClasses = {
    compact: "text-lg md:text-xl",
    default: "text-2xl md:text-4xl",
    large: "text-4xl md:text-6xl",
  };

  const boxClasses = {
    compact: "w-12 h-12 md:w-14 md:h-14",
    default: "w-16 h-16 md:w-20 md:h-20",
    large: "w-20 h-20 md:w-28 md:h-28",
  };

  return (
    <div className={`flex items-center justify-center gap-2 md:gap-4 ${className}`}>
      {timeUnits.map(
        (unit, index) =>
          unit.show && (
            <div key={unit.label} className="flex flex-col items-center">
              <motion.div
                className={`${boxClasses[variant]} flex items-center justify-center bg-card border border-border rounded-lg`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.span
                  key={unit.value}
                  className={`${sizeClasses[variant]} font-bold text-primary font-montserrat`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatNumber(unit.value)}
                </motion.span>
              </motion.div>
              {showLabels && (
                <span className="text-xs md:text-sm text-muted-foreground mt-1">
                  {unit.label}
                </span>
              )}
            </div>
          )
      )}
    </div>
  );
};
