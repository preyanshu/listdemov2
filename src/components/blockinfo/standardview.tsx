
import { Flex, Text, Divider, Badge, Card, Box } from "@chakra-ui/react";
import { CalendarIcon } from "@/components/blockinfo/icons";

import { BlockDataResponse } from "@/types/blockinfo";


// import { Icon } from "@chakra-ui/react";

function StandardBlockInfoCard({ bg , blockData}: { bg: string , blockData: BlockDataResponse }) {


  const blockTime = new Date(blockData.block.header.time);
  const localTime = blockTime.toLocaleString();

  
  return (
    <Card
      p={6}
      rounded="md"
      w={"100%"} // Responsive width
     
      bg={bg}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        #{blockData.block.header.height}
      </Text>

     

      {/* Scrollable Box for Time Details */}
      <Box overflowX="auto" whiteSpace="nowrap" mb={4} >
      <Box minWidth={"600px"}>
        <Flex justifyContent="space-between" mb={3}>
          <Text>Local Time</Text>
          <Text color="green.300">{localTime}</Text>
        </Flex>

        <Flex justifyContent="space-between" mb={3}>
          <Text>UTC Time</Text>
          <Flex alignItems="center">
            <Badge colorScheme="blue" mr={2}>
             <CalendarIcon/>;
            </Badge>
            <Text>UTC ({new Date(blockData.block.header.time).toUTCString()})</Text>
          </Flex>
        </Flex>

      </Box>
      </Box>

      <Divider borderColor="gray.600"  mb={6} />

      {/* Scrollable Box for Hash and Address */}
      <Box overflowX="auto" >
        <Box minWidth={"600px"}>
        
      <Flex justifyContent="space-between" mb={3}>
          <Text>Chain ID</Text>
          <Text>{blockData.block.header.chain_id}</Text>
        </Flex>
        <Flex justifyContent="space-between" mb={3} alignItems="center">
          <Text>Block Hash</Text>
          <Flex alignItems="center">
            <Text mr={2} isTruncated>
              {blockData.block_id.hash}
            </Text>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mb={3}>
          <Text>Proposer Address</Text>
          <Flex alignItems="center">
            <Text mr={2} isTruncated>
              {blockData.block.header.proposer_address}
            </Text>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mb={3}>
          <Text>Block Height</Text>
          <Text>{blockData.block.header.height}</Text>
        </Flex>

        <Flex justifyContent="space-between" mb={3}>
          <Text>Round</Text>
          <Text>{blockData.block.last_commit.round}</Text>
        </Flex>

        <Flex justifyContent="space-between" mb={3}>
          <Text>TX Counts</Text>
          <Text>{blockData.block.data.txs.length}</Text>
        </Flex>
      </Box>
      </Box>
    </Card>
  );
}

export default StandardBlockInfoCard;
