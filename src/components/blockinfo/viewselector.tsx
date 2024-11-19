'use client';
import React from 'react'
import {
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Icon,
    Text,
    Flex,
  } from '@chakra-ui/react';
  import { ChevronDownIcon } from '@chakra-ui/icons';
    import { MdViewList, MdViewModule, MdViewComfy } from 'react-icons/md';
  import { useRouter } from 'next/navigation';

const ViewSelector = ({cardBg,view}:{cardBg:string , view:string}) => {

    const router = useRouter();
    


    const handleViewChange = (newView: string) => {
        router.push(`?view=${newView}`);
      };

    const getViewLabelAndIcon = () => {
        switch (view) {
          case 'simple':
            return { label: 'Simple', icon: MdViewList };
          case 'extended':
            return { label: 'Extended', icon: MdViewModule };
          case 'comprehensive':
            return { label: 'Comprehensive', icon: MdViewComfy };
          default:
            return { label: '', icon: null };
        }
      };
    
      const { label, icon } = getViewLabelAndIcon();

  return (
    <Box position="absolute" top={0} right={0}>
    {/* Menu */}
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Icon as={icon || undefined} boxSize={5} mr={2} />
          <Text>{label}</Text>
        </Flex>
      </MenuButton>
      <MenuList bg={cardBg}>
        <MenuItem
          icon={<Icon as={MdViewList} />}
          onClick={() => handleViewChange('simple')}
          bg={cardBg}
        >
          Simple
        </MenuItem>
        <MenuItem
          icon={<Icon as={MdViewModule} />}
          onClick={() => handleViewChange('extended')}
          bg={cardBg}
        >
          Extended
        </MenuItem>
        <MenuItem
          icon={<Icon as={MdViewComfy} />}
          onClick={() => handleViewChange('comprehensive')}
          bg={cardBg}
        >
          Comprehensive
        </MenuItem>
      </MenuList>
    </Menu>
  </Box>
  )
}

export default ViewSelector