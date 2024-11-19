// types.ts or models.ts

export type BlockId = {
    hash: string;
    part_set_header: {
      total: number;
      hash: string;
    };
  };
  
  export type BlockHeader = {
    version: {
      block: string;
      app: string;
    };
    chain_id: string;
    height: string;
    time: string;
    last_block_id: BlockId;
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
  };
  
  export type Transaction = string; 
  
  export type LastCommit = {
    height: string;
    round: number;
    block_id: BlockId;
    signatures: {
      block_id_flag: string;
      validator_address: string;
      timestamp: string;
      signature: string;
    }[];
  };
  
  export type BlockData = {
    txs: Transaction[];
  };
  
  export type Evidence = {
    evidence: any[];  
  };
  
  export type SdkBlock = {
    header: BlockHeader;
    data: BlockData;
    evidence: Evidence;
    last_commit: LastCommit;
  };
  
  export type BlockDataResponse = {
    message ?: string;
    block_id: BlockId;
    block: {
      header: BlockHeader;
      data: BlockData;
      evidence: Evidence;
      last_commit: LastCommit;
    };
    sdk_block: SdkBlock;
  };
  