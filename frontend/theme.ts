// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config, 
  fonts: {
    heading: `'IBM Plex Mono', sans-serif`,
    body: `'IBM Plex Mono', sans-serif`,
  },
})

// // 3. extend the theme
// const theme = extendTheme({ config })

export default theme