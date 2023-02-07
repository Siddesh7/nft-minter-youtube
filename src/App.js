import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import NftMinter from "./form";
import { polygonMumbai } from "wagmi/chains";
export const Shardeum = {
  id: 8081,
  name: "Shardeum",
  network: "Shardeum Liberty 2.X",
  nativeCurrency: {
    decimals: 18,
    name: "Shardeum",
    symbol: "SHM",
  },
  rpcUrls: {
    public: { http: ["https://liberty20.shardeum.org"] },
    default: { http: ["https://liberty20.shardeum.org"] },
  },
  blockExplorers: {
    default: {
      name: "Shardeum",
      url: "https://explorer-liberty20.shardeum.org/",
    },
  },
};
const chains = [Shardeum];
const client = createClient(
  getDefaultClient({
    appName: "NFTMinter",
    chains,
  })
);

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="soft">
        <NftMinter />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
export default App;
