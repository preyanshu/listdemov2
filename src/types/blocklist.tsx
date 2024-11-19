type Proposer = {
    operatorAddress: string;
    avatar: string;
    moniker: string;
  };

export type Block = {
    height: number;
    hash: string;
    timestamp: string;
    transCount: number;
    proposer: Proposer;
    txs: number;
};
  
export type BlockListType = {
    data: Block[];
    next_cursor: string;
  
};