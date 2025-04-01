
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

const AuthButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const handleConnect = async () => {
    try {
      connect({ connector: new MetaMaskConnector() });
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to MetaMask");
    }
  };

  if (isConnected && address) {
    return (
      <Button variant="outline" disabled className="bg-blue-900 text-white border-blue-700">
        <Wallet className="mr-2" size={16} />
        {address.substring(0, 6)}...{address.substring(address.length - 4)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} variant="outline" className="bg-blue-900 hover:bg-blue-800 text-white border-blue-700">
      <Wallet className="mr-2" size={16} />
      Connect MetaMask
    </Button>
  );
};

export default AuthButton;
