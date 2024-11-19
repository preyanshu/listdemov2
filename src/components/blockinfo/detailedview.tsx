
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Flex,
  List,
  ListItem,
  Card,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,

} from '@chakra-ui/react';

import JsonViewer from './jsonview';
import {Icon , MdFingerprint , MdTimeline} from '@/components/blockinfo/icons'
import { decodeTxRaw , DecodedTxRaw} from "@cosmjs/proto-signing";
import crypto from "crypto";

import { BlockDataResponse } from '@/types/blockinfo';



interface DecodedTransaction {
  messageType: string;
  memo: string;
  hash: string;
}

function decodeTx(txs: string): DecodedTransaction {
  // Decode the transaction
  const tx: DecodedTxRaw = decodeTxRaw(new Uint8Array(Buffer.from(txs, "base64")));

  const fullTypeUrl = tx.body.messages[0].typeUrl;
  const messageType = fullTypeUrl.substring(fullTypeUrl.lastIndexOf(".") + 1);

  // Calculate transaction hash
  const txHash = crypto.createHash("sha256").update(new Uint8Array(Buffer.from(txs, "base64"))).digest("hex");

  // Return the extracted parameters
  return {
    messageType,
    memo: tx.body.memo,
    hash: txHash,
  };
}


const DetailedBlockInfoCard = ({view,bg ,blockData} : { view: string,bg:string ,blockData : BlockDataResponse }) => {

  
  const { block_id, block } = blockData;



 
  return (
    <Box >

      {/* Block ID Card */}
      <Card p={6} boxShadow="md" mb={6} bg={bg} w={"100%"} >
        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize="2xl" fontWeight="bold"  >
            #{block.header.height}
          </Text>
           <Icon as={MdFingerprint}  color="green.300"  boxSize={6} /> 
        </Flex>
        <Divider borderColor="gray.600" my={4} />
        <Box overflowX="auto"   >
          <Box minWidth={"600px"} pb={2}>
        <Stack spacing={3}>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400" >Hash</Text>
            <Text >{block_id.hash}</Text>
          </Flex>
          {/* Part Set Header */}
          {view ==='comprehensive' && <>
            <Text fontWeight="bold"  mt={4} >
            Part Set Header
          </Text>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400" ml={3} >Total</Text>
            <Text >{block_id.part_set_header.total}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400" ml={3} >Hash</Text>
            <Text >{block_id.part_set_header.hash}</Text>
          </Flex>
          </>}
          
        </Stack>
        </Box>
      </Box>
      </Card>

      {/* Block Details Card */}
      <Card p={6} boxShadow="md" mb={6} bg={bg} w={"100%"}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h3" size="md" >
            Block Header
          </Heading>
          <Icon as={MdTimeline} color="green.300" boxSize={6} /> 
        </Flex>
        <Divider borderColor="gray.600" my={4} />

        
        <Stack spacing={3}>
        <Box overflowX="auto" whiteSpace="nowrap"  >
        <Box minWidth={"600px"}>
        <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium" color="gray.400" >Chain ID</Text>
            <Text >{block.header.chain_id}</Text>
          </Flex>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium" color="gray.400" >Height</Text>
            <Text >{block.header.height}</Text>
          </Flex>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium" color="gray.400" >Time</Text>
            <Text color={"green.300"}>{block.header.time}</Text>
          </Flex>

        <Text fontWeight="bold"  mt={4} mb={2} >
           Version
          </Text>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium" color="gray.400" ml={3}  >Block</Text>
            <Text >{block.header.version.block}</Text>
          </Flex>
          <Flex justify="space-between" mb={2} >
            <Text fontWeight="medium" color="gray.400" ml={3}  >App</Text>
            <Text >{block.header.version.app}</Text>
          </Flex>
         
         

              <Text fontWeight="bold"  mt={4} mb={2} >
              Last Block ID
          </Text>
          <Flex justify="space-between" ml={3}>
            <Text fontWeight="medium" color="gray.400" mb={2} >Hash</Text>
            <Text >{block.header.last_block_id.hash}</Text>
          </Flex>

         {view ==='comprehensive' && <> <Box  ml={3}>
            <Text fontWeight="medium"  >Part Set Header</Text>
            <Flex justify="space-between"  ml={3} mt={3}>
            <Text fontWeight="medium" color="gray.400" >Total</Text>
            <Text >{block.header.last_block_id.part_set_header.total}</Text>
          </Flex>
          <Flex justify="space-between"  ml={3} mt={3}>
            <Text fontWeight="medium" color="gray.400" >Hash</Text>
            <Text >{block.header.last_block_id.part_set_header.hash}</Text>
          </Flex>
          </Box></>}
         
        </Box>
        </Box>
         {/* hash footer */}
         <Box overflowX="auto" whiteSpace="nowrap"  >
         <Box minWidth={"600px"}>
         {
            view ==='comprehensive' && <>

<Divider borderColor="gray.600" my={4} />
      
      <List spacing={3}>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400">Last Commit Hash</Text>
            <Text >
              {block.header.last_commit_hash}
            </Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400" >Data Hash</Text>
            <Text >{block.header.data_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium" color="gray.400" >Validators Hash</Text>
            <Text >{block.header.validators_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium"  color="gray.400" >Next Validators Hash</Text>
            <Text >{block.header.next_validators_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium"  color="gray.400" >Consensus Hash</Text>
            <Text >{block.header.consensus_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium"  color="gray.400" >App Hash</Text>
            <Text >{block.header.app_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium"  color="gray.400" >Last Results Hash</Text>
            <Text >{block.header.last_results_hash}</Text>
          </Flex>
        </ListItem>
        <ListItem>
          <Flex justify="space-between">
            <Text fontWeight="medium"  color="gray.400" >Evidence Hash</Text>
            <Text >{block.header.evidence_hash}</Text>
          </Flex>
        </ListItem>
      </List>
            
            </>
         }
          </Box>
          </Box>
            
        
        </Stack>
      </Card>

      <TabsCard view={view} bg={bg} blockData={blockData} />
    </Box>
  );
};

export default DetailedBlockInfoCard;




const TabsCard = ({view, bg , blockData} : {view:string,bg:string,blockData:BlockDataResponse })=>{
  const { block} = blockData;
  const {last_commit} = block;
  return(
    <>
      <Card p={{ base: 1, md: 2, lg: 6 }} boxShadow="md" bg={bg }  w={"100%"}>
  <Tabs variant="line">
    <TabList>
      <Tab>Signers</Tab>
      <Tab>Transactions</Tab>
      {view==="comprehensive" && <Tab>Raw JSON</Tab>}
      {/* <Tab>Raw JSON</Tab> */}
    </TabList>

    <TabPanels>
      {/* Signers Tab */}
      <TabPanel>
        <Box my={4} mb={8}>
        <Box overflowX="auto"  mb={4} >
        <Box minWidth={"600px"} pb={2}>
        <List spacing={3}>
        <ListItem>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.400">Height</Text>
                <Text >
                 {block.last_commit.height}
                </Text>
              </Flex>
            </ListItem>

            <ListItem>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.400" >Round</Text>
                <Text >{block.last_commit.round}</Text>
              </Flex>
            </ListItem>
          
           
            <Text fontWeight="bold"  mt={4} >
              Block ID
          </Text>
          <Flex justify="space-between" ml={3}>
            <Text fontWeight="medium" color="gray.400" >Hash</Text>
            <Text >{block.last_commit.block_id.hash}</Text>
          </Flex>

         {view ==='comprehensive' && <> <Box  ml={3}>
            <Text fontWeight="medium"  >Part Set Header</Text>
            <Flex justify="space-between"  ml={3} mt={3}>
            <Text fontWeight="medium" color="gray.400" >Total</Text>
            <Text >{block.last_commit.block_id.part_set_header.total}</Text>
          </Flex>
          <Flex justify="space-between"  ml={3} mt={3}>
            <Text fontWeight="medium" color="gray.400" >Hash</Text>
            <Text >{block.last_commit.block_id.part_set_header.hash}</Text>
          </Flex>
          </Box></>}

          
            
        
           
          </List>
        </Box>
        </Box>
        </Box>
          
        <Divider borderColor="gray.600" my={4} />
        <Box width={"100%"} overflow={"auto"} maxHeight={"300px"}>
        <Table variant="simple" >
  <Thead>
    <Tr>
      <Th>Block Id Flag</Th>
      <Th>Validator Address</Th>
      <Th>TimeStamp</Th>
      <Th>Signature</Th>
    </Tr>
  </Thead>
  <Tbody>
    {/* Map through signers data and display rows */}
    {last_commit.signatures.map((signer, index) => (
      <Tr key={index}>
        <Td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{signer.block_id_flag}</Td>
        <Td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{signer.validator_address}</Td>
        <Td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }} color={"green.300"}>{signer.timestamp}</Td>
        <Td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{signer.signature}</Td>
      </Tr>
    ))}
  </Tbody>
</Table>

        </Box>
       

      </TabPanel>

      {/* Transactions Tab */}
      <TabPanel>
      <Box width={"100%"} overflow={"auto"}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Tx Hash</Th>
              <Th>Memo</Th>
              <Th>Messages</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Map through transactions data and display rows */}
            {block.data.txs.length===0 && <Tr><Td colSpan={10} style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>No transactions found</Td></Tr>}

            {block.data.txs.length !== 0 &&
  block.data.txs.map((tx: string, index: number) => {
    const decodedTx = decodeTx(tx); // Decode the transaction

    return (
      <Tr key={index}>
        {/* Transaction Hash */}
        <Td style={{ fontSize: "0.8rem", whiteSpace: "nowrap"}} color={"green.300"}>
          {decodedTx.hash || "-"}
        </Td>
        {/* Transaction Memo */}
        <Td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {decodedTx.memo || "-"}
        </Td>
        {/* Transaction Message Type */}
        <Td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {decodedTx.messageType || "-"}
        </Td>
      </Tr>
    );
  })}

          </Tbody>
        </Table>
        </Box>
      </TabPanel>

      {/* Raw JSON Tab */}
        {view==="comprehensive" && <>
            <TabPanel>
         <JsonViewer blockData={blockData}/>
            </TabPanel>
        </>}
    </TabPanels>
  </Tabs>
</Card>
    </>
  )

}
