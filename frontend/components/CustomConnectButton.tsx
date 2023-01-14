import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} style={{
                    display: "flex",
                    alignItems: 'center', 
                    color: "white",
                    borderRadius: "25px",
                    borderColor: "white",
                    borderStyle: "solid", 
                    padding: "10px", 
                    backgroundImage: "linear-gradient(to right, #651fff, #761cc3)"
                  }}
                  type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openAccountModal} type="button" style={{
                    display: "flex",
                    alignItems: 'center', 
                    color: "white",
                    borderRadius: "25px",
                    borderColor: "white",
                    borderStyle: "solid", 
                    padding: "10px", 
                    backgroundImage: "linear-gradient(to right, #651fff, #761cc3)"
                  }}>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};


