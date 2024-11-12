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
  IconButton,
  Box,
  MenuButton,
  Button,
  Menu,
  Flex,
  MenuList,
  MenuItem,
  Skeleton
} from '@chakra-ui/react';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineClipboardCopy } from 'react-icons/hi';
import { ChevronDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { FaSync } from 'react-icons/fa';

// Types
type Proposer = {
  operatorAddress: string;
  avatar: string;
  moniker: string;
};

type Block = {
  height: number;
  hash: string;
  timestamp: string; 
  transCount: number;
  proposer: Proposer;
  txs: number;
};

type ApiResponse = {
  data: Block[];
  next_cursor: string;
};

const toBase64 = (num: number) => Buffer.from(num.toString()).toString('base64');

const BlockList = () => {
  const [blocks, setBlocks] = useState<Block[]>([]); // State for blocks
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [nextCursor, setNextCursor] = useState<string | null>(null); // Cursor for fetching new blocks
  const [endPageCursor, setEndPageCursor] = useState<string | null>(null); // Store end cursors
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState<number>(25); // Rows per page
  const [fetchInterval, setFetchInterval] = useState<number>(3000); // Interval for fetching latest blocks

  const totalPagesCalc = Math.ceil(blocks[0]?.height / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedBlocks = blocks.slice(startIndex, startIndex + rowsPerPage);


  const refetchBlocks = async () => {
    try {
      setLoading(true);
      const url = `https://andromeda.api.explorers.guru/api/v1/blocks?limit=${rowsPerPage}`;
      const res = await fetch(url);
      const data: ApiResponse = await res.json();

      setBlocks(data.data);
      const newCursor = toBase64(data.data[data.data.length - 1].height);
      setEndPageCursor(newCursor);
      setNextCursor(toBase64(data.data[0].height));
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlocks = async (page: number = 1, rowsPerPage: number = 25, initial: boolean = false) => {
    try {
      setLoading(true);

      const url = `https://andromeda.api.explorers.guru/api/v1/blocks?limit=${rowsPerPage}&cursor=${endPageCursor || ''}`;
      const res = await fetch(url);
      const data: ApiResponse = await res.json();

      setBlocks((prev) => [...prev, ...data.data]);

      const newCursor = toBase64(data.data[data.data.length - 1].height);
      setEndPageCursor(newCursor);

      if (page === 1) {
        setNextCursor(toBase64(data.data[0].height));
      }

    } catch (error) {
      console.error('Failed to fetch blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBlock = async () => {
    try {
      if (!nextCursor) return;

      const res = await fetch(`https://andromeda.api.explorers.guru/api/v1/blocks?limit=1&cursor=${nextCursor}&order_by=asc`);
      const data: ApiResponse = await res.json();

      if (data.data.length > 0) {
        const newBlock = data.data[0];

        setBlocks((prevBlocks) => {
          const latestHeight = prevBlocks.length > 0 ? prevBlocks[0].height : null;

          // Append only if the new block is created after the latest block in the array
          if (latestHeight === null || newBlock.height > latestHeight) {
            setNextCursor(toBase64(newBlock.height));
            return [newBlock, ...prevBlocks]; // Prepend the new block
          }

          // If no update, return the previous blocks unchanged
          return prevBlocks;
        });
      }
    } catch (error) {
      console.error('Failed to fetch new block:', error);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchLatestBlock, fetchInterval); // 3-second interval
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [nextCursor, fetchInterval]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleFetchIntervalChange = (interval: number) => {
    setFetchInterval(interval);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      return newPage;
    });
  };

  const handleNextPage = async () => {
    const newPage = currentPage + 1;
    const startIndex = (newPage - 1) * rowsPerPage;
    const displayedBlocks = blocks.slice(startIndex, startIndex + rowsPerPage);

    if (displayedBlocks.length < rowsPerPage) {
      await fetchBlocks(newPage, rowsPerPage);
    }

    setCurrentPage(newPage);
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = dayjs();
    const past = dayjs(timestamp);
    const diffInSeconds = now.diff(past, 'second');
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    return minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''} ago` : `${seconds}s ago`;
  };

  return (
    <Center height="100vh" width="100vw" flexDirection={"column"}>
      <HStack spacing={4} width={{ base: '90vw', md: '70vw' }} mb={3} justifyContent={"flex-end"}>
        <Text>Fetch interval:</Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isDisabled={loading}>
            {fetchInterval / 1000}s
          </MenuButton>
          <MenuList bg="#2D2E30">
            {[2000, 3000, 5000].map((interval) => (
              <MenuItem key={interval} onClick={() => handleFetchIntervalChange(interval)}  bg="#2D2E30"  _hover={{ bg: '#212226' }}>
                {interval / 1000}s
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Button mr={3} onClick={refetchBlocks} isDisabled={loading}>
          Refetch <FaSync size={16} style={{ marginLeft: '12px' }} color='gray.400' />
        </Button>
      </HStack>

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
          {loading && (
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
          )}

          {!loading && (
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
              <Box my={4}></Box>
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
          )}
        </TableContainer>

        <Box overflowX={"auto"} pb={1}>
          <Box mt={6} display="flex" justifyContent="flex-end" alignItems="center" paddingX={4} minWidth={"500px"}>
            <HStack spacing={4} alignItems="center" mr={5}>
              <Text>Rows per page:</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isDisabled={loading}>
                  <Flex alignItems="center">
                    <Text>{rowsPerPage}</Text>
                  </Flex>
                </MenuButton>
                <MenuList bg="#2D2E30">
                  <MenuItem onClick={() => handleRowsPerPageChange(15)} _hover={{ bg: '#212226' }} bg="#2D2E30">
                    15
                  </MenuItem>
                  <MenuItem onClick={() => handleRowsPerPageChange(25)} _hover={{ bg: '#212226' }} bg="#2D2E30">
                    25
                  </MenuItem>
                  <MenuItem onClick={() => handleRowsPerPageChange(50)} _hover={{ bg: '#212226' }} bg="#2D2E30">
                    50
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            <HStack spacing={4}>
              <IconButton
                icon={<HiOutlineArrowLeft />}
                onClick={handlePreviousPage}
                isDisabled={(currentPage === 1) || loading}
                aria-label="Previous Page"
                variant="ghost"
              />
              <Text>
                {currentPage} of {isNaN(totalPagesCalc) ? 1 : totalPagesCalc}
              </Text>
              <IconButton
                icon={<HiOutlineArrowRight />}
                onClick={handleNextPage}
                isDisabled={(currentPage === totalPagesCalc) || loading}
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
