'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Center,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Avatar,
  HStack,
  Select,
  IconButton,
  Box,
  Spacer,
  Tooltip,
  MenuButton,
  Button,
  Menu,
  Flex,
  Icon,
  MenuList,
  MenuItem,
  Skeleton
} from '@chakra-ui/react';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineClipboardCopy } from 'react-icons/hi';
import { ChevronDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';

// Helper function to encode a number in base64
const toBase64 = (num) => Buffer.from(num.toString()).toString('base64');

const BlockList = () => {
  const [blocks, setBlocks] = useState([]); // State for blocks
  const [loading, setLoading] = useState(true); // Loading state
  const [nextCursor, setNextCursor] = useState(null); // Cursor for fetching new blocks
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(25); // Rows per page
  const [lastAppendedHeight, setLastAppendedHeight] = useState(null); // Last appended block height

  const totalPages = Math.ceil(blocks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedBlocks = blocks.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    const fetchInitialBlocks = async () => {
      try {
        const res = await fetch(`https://andromeda.api.explorers.guru/api/v1/blocks?limit=${rowsPerPage}`);
        const data = await res.json();
        setBlocks(data.data);
        setNextCursor(toBase64(data.data[0].height)); // Convert height to base64
        setLastAppendedHeight(data.data[0].height || null); // Set the height of the first block fetched
      } catch (error) {
        console.error('Failed to fetch blocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialBlocks();
  }, [rowsPerPage]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://andromeda.api.explorers.guru/api/v1/blocks?limit=1&cursor=${nextCursor}&order_by=asc`);
        const data = await res.json();

        if (data.data.length > 0) {
          const newBlock = data.data[0];

          // Append only if the new block is created after the last appended block
          if (lastAppendedHeight === null || newBlock.height > lastAppendedHeight) {
            setBlocks([newBlock, ...blocks]); // Prepend the new block
            setLastAppendedHeight(newBlock.height); // Update the last appended height
            setNextCursor(toBase64(newBlock.height)); // Update cursor for the next fetch
          }

          if (newBlock.height === lastAppendedHeight) {
            setNextCursor(toBase64(newBlock.height + 1));
          }
        }
      } catch (error) {
        console.error('Failed to fetch new block:', error);
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [nextCursor, lastAppendedHeight, blocks]);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash); // Copy hash to clipboard
  };

  const formatRelativeTime = (timestamp) => {
    const now = dayjs();
    const past = dayjs(timestamp);
    const diffInSeconds = now.diff(past, 'second');
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    return minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''} ago` : `${seconds}s ago`;
  };

  if (loading) {
    return (
      <Center height="100vh" width="100vw">
        <Card   width={{ base: '90vw', md: '70vw' }} padding={5} borderRadius="md" boxShadow="xl" minHeight="70vh" bg="#2D2E30">
          <TableContainer height="65vh" overflow="auto" >
            <Table size="sm" variant={"line"} minWidth={"500px"}>
              <Thead>
                <Tr>
                  <Th color="#4F5051"><Skeleton height="20px" /></Th>
                  <Th color="#4F5051"><Skeleton height="20px" /></Th>
                  <Th color="#4F5051"><Skeleton height="20px" /></Th>
                  <Th color="#4F5051"><Skeleton height="20px" /></Th>
                  <Th color="#4F5051"><Skeleton height="20px" /></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from({ length: rowsPerPage }).map((_, index) => (
                  <Tr key={index}>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </Center>
    );}

  return (
    <Center height="100vh" width="100vw">
      <Card
        width={{ base: '90vw', md: '70vw' }}
        color="white"
        padding={5}
        borderRadius="md"
        boxShadow="xl"
        minHeight="70vh"
        display="flex"
        flexDirection="column"
        bg="#2D2E30"
      >
        <TableContainer height="65vh" overflowY="auto">
          <Table size="sm" variant="line">
            <Thead>
              <Tr>
                <Th color="gray.400">Height</Th>
                <Th color="gray.400">Hash</Th>
                <Th color="gray.400">Proposer</Th>
                <Th color="gray.400">No. of Txs</Th>
                <Th color="gray.400">Time</Th>
              </Tr>
            </Thead>
            {/* spacer */}
            <Box my={4}>

            </Box>
            <Tbody>
              {displayedBlocks.map((block, index) => (
                <Tr key={block.timestamp} bg={index % 2 === 0 ? '#212226' : 'transparent'} borderBottom="none">
                  <Td color="blue.300">{block.height}</Td>
                  <Td>
                    {/* Display hash with copy functionality */}
                    {`${block.hash.slice(0, 6)}...${block.hash.slice(-6)}`}
                  </Td>
                  <Td>
                    <HStack>
                      <Avatar size="xs" name={block.proposer.moniker} src={block.proposer.avatar} />
                      <Text color="blue.300">{block.proposer.moniker}</Text>
                    </HStack>
                  </Td>
                  <Td>{block.txs}</Td>
                  <Td color="green.300">{formatRelativeTime(block.timestamp)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        
<Box overflowX={"auto"} pb={1}>
<Box
  mt={6}
  display="flex"
  justifyContent="flex-end"
  alignItems="center"
  paddingX={4} 
  minWidth={"500px"}
>
  <HStack spacing={4} alignItems="center" mr={5}  >
    <Text>Rows per page:</Text>
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Text>{rowsPerPage}</Text>
        </Flex>
      </MenuButton>
      <MenuList bg="#2D2E30">
        <MenuItem
          onClick={() => handleRowsPerPageChange(15)}
          _hover={{ bg: '#212226' }}
          bg="#2D2E30"
        >
          15
        </MenuItem>
        <MenuItem
          onClick={() => handleRowsPerPageChange(25)}
          _hover={{ bg: '#212226' }}
          bg="#2D2E30"
        >
          25
        </MenuItem>
        <MenuItem
          onClick={() => handleRowsPerPageChange(50)}
          _hover={{ bg: '#212226' }}
          bg="#2D2E30"
        >
          50
        </MenuItem>
      </MenuList>
    </Menu>
  </HStack>

  <HStack spacing={4} >
    <IconButton
      icon={<HiOutlineArrowLeft />}
      onClick={handlePreviousPage}
      isDisabled={currentPage === 1}
      aria-label="Previous Page"
      variant="ghost"
    />
    <Text>
      {currentPage} of {totalPages}
    </Text>
    <IconButton
      icon={<HiOutlineArrowRight />}
      onClick={handleNextPage}
      isDisabled={currentPage === totalPages}
      aria-label="Next Page"
      variant="ghost"
    />
  </HStack>
</Box>

</Box>
      

      </Card>
    </Center>
  );
};

export default BlockList;
