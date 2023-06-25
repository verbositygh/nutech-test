'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { FC, PropsWithChildren } from "react";

const queryClient = new QueryClient()

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

export default Providers;
