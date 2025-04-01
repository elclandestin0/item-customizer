import { createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { getTokenContract } from '@/utils/contract';

interface ContractContextType {
  contract: ethers.Contract;
}

const ContractContext = createContext<ContractContextType | null>(null);

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const contract = getTokenContract();

  return (
    <ContractContext.Provider value={{ contract }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}; 