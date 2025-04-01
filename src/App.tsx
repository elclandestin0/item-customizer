import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContractProvider } from "@/context/ContractContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WagmiProvider, createConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { http } from "viem";
import { injected } from "wagmi/connectors";

const queryClient = new QueryClient();

// Set up wagmi config
const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('localhost:4000'),
  },
  connectors: [injected()],
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <ContractProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ContractProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default App;
