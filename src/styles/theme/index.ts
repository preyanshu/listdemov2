// theme.ts

import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Color mode configuration
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

// Custom color palette
const colors = {
  brand: {
    50: '#e7e7ff',
    100: '#c2c2f4',
    200: '#9c9ce9',
    300: '#7575de',
    400: '#4f4fd3',
    500: '#3838ba', // Primary color for dark mode
    600: '#2b2b8e',
    700: '#1f1f62',
    800: '#121235',
    900: '#06060b',
  },
  background: {
    light: '#2a2a2e',
    dark: '#1c1c1f',
  },
  text: {
    light: '#e4e4e8',
    dark: '#ffffff',
  },
  card :{
    light: '#ffffff',
    dark: '#2E2E30',
  }
}

// Extending theme with component-specific styles
const theme = extendTheme({
  config,
  colors,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'background.dark' : 'white',
        color: props.colorMode === 'dark' ? 'text.dark' : 'gray.800',
      }
    }),
  },
})

export default theme
