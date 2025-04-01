
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";

const AuthButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      connect({ connector: metaMask() });
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to MetaMask");
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      toast.success("Successfully disconnected");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Failed to disconnect");
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" disabled className="bg-blue-900 text-white border-blue-700">
          <Wallet className="mr-2" size={16} />
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </Button>
        <Button 
          onClick={handleDisconnect} 
          variant="outline" 
          className="bg-red-900 hover:bg-red-800 text-white border-red-700"
        >
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>
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
