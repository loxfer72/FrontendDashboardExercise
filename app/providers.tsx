"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect } from "react";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((s) => s.theme.isDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </Provider>
  );
}