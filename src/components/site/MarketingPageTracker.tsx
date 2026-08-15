import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { captureMarketingAttribution, recordMarketingEvent } from "@/lib/marketing";

export function MarketingPageTracker() {
  const href = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    const attribution = captureMarketingAttribution();
    recordMarketingEvent("landing_view", {
      attribution,
      metadata: { href },
    });
  }, [href]);

  return null;
}
