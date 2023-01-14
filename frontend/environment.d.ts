declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string
        GOERLI_RPC_URL: string
        GOERLI_PRIVATE_KEY: string
        NEXT_PUBLIC_GOERLI_POLL_CONTRACT: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}