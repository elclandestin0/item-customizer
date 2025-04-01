
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContractProvider } from "@/context/ContractContext";
import { WagmiConfig, createConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { http } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Set up wagmi config for Wagmi v2
const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
  connectors: [
    new MetaMaskConnector()
  ],
});

const App = () => (
  <WagmiConfig config={config}>
    <QueryClientProvider client={queryClient}>
      <ContractProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ContractProvider>
    </QueryClientProvider>
  </WagmiConfig>
);

export default App;
