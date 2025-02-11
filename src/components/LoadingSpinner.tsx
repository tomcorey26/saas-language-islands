import * as React from "react";

import { Progress } from "@/components/ui/progress";

export function LoadingSpinner() {
  const [progress, setProgress] = React.useState(13);
  const countRef = React.useRef(0);
  const intervalRef = React.useRef<NodeJS.Timeout>(null);

  React.useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset count when effect runs
    countRef.current = 0;
    setProgress(13);

    intervalRef.current = setInterval(() => {
      countRef.current += 1;
      setProgress(() => {
        if (countRef.current >= 7) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 95;
        }
        return 13 + countRef.current * 13;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <Progress value={progress} className="w-[60%]" />;
}
