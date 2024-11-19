'use client'
import React from 'react'
import { Box } from '@chakra-ui/react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';



const JsonViewer = ({blockData} : {blockData : any}) => {
  return (
    <Box style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '8px' }}>
    <JsonView
      src={blockData}
      collapsed={3}
      style={{ backgroundColor: 'transparent', padding: '10px' }} 
      dark={true}
    />
  </Box>
  )
}

export default JsonViewer