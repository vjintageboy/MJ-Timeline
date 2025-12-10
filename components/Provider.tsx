"use client"

import "@iota/dapp-kit/dist/index.css"
import "@radix-ui/themes/styles.css"
import { IotaClientProvider, WalletProvider } from "@iota/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Theme } from "@radix-ui/themes"
import { networkConfig } from "@/lib/config"
import { ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"

const queryClient = new QueryClient()

interface ProvidersProps {
  children: ReactNode
}

export function Provider({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <IotaClientProvider networks={networkConfig} defaultNetwork="devnet">
          <WalletProvider autoConnect>
            <Theme appearance="dark">{children}</Theme>
          </WalletProvider>
        </IotaClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}



