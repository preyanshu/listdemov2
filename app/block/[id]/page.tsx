import DetailedBlockInfoCard from '@/components/blockinfo/detailedview';
import StandardBlockInfoCard from '@/components/blockinfo/standardview';
import { Box, Text, Card, CardBody } from '@chakra-ui/react';
import React from 'react';
import ViewSelector from '@/components/blockinfo/viewselector';

//types
import { BlockDataResponse } from '@/types/blockinfo';
import { BlockListType , Block} from '@/types/blocklist';

interface SearchParams {
  view: string;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const blocks: BlockListType = await fetch('https://andromeda.api.explorers.guru/api/v1/blocks?limit=25').then((res) =>
    res.json()
  );

  const paths = blocks.data.map((block: Block) => ({
    id: block.height.toString(),
  }));


  return paths;
}

const Page = async ({ searchParams, params }: { searchParams: SearchParams; params: { id: string } }) => {
  const cardBg = 'card.dark';
  const view = searchParams.view || 'simple';

  const blockData: BlockDataResponse = await fetch(
    `https://andro.api.m.stavr.tech/cosmos/base/tendermint/v1beta1/blocks/${params.id || 'latest'}`
  ).then((res) => res.json());

  // Check if blockData.block is null
  if (!blockData.block) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt="10vh">
        <Box paddingBottom="10vh" w={{ base: '90vw', md: '60vw' }} position="relative">
          <Card bg={cardBg}>
            <CardBody>
              <Text fontSize="lg" color="red.500">
               {'Error: '+blockData.message|| 'Error: Block data is unavailable. Please check the block ID or try again later.'}
              </Text>
            </CardBody>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="10vh">
      {/* Dropdown for View Selection */}
      <Box paddingBottom="10vh" w={{ base: '90vw', md: '60vw' }} position="relative">
        <ViewSelector cardBg={cardBg} view={view} />
        {/* Display the selected view component */}
        <Box mt={16}>
          {view === 'simple' && <StandardBlockInfoCard bg={cardBg} blockData={blockData} />}
          {view === 'extended' && <DetailedBlockInfoCard view="extended" bg={cardBg} blockData={blockData} />}
          {view === 'comprehensive' && <DetailedBlockInfoCard view="comprehensive" bg={cardBg} blockData={blockData} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
