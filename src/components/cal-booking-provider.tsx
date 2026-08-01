"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export function CalBookingProvider({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "kwaku-booking" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  useEffect(() => {
    const handleTrigger = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest("[data-cal-modal]");
      if (trigger) {
        e.preventDefault();
        const cal = (window as any).Cal;
        if (cal) {
          cal("modal", {
            calLink: "kwakulotteryy/15min"
          });
        }
      }
    };

    document.addEventListener("click", handleTrigger);
    return () => {
      document.removeEventListener("click", handleTrigger);
    };
  }, []);

  return <>{children}</>;
}
