- find a way to fix `./node_modules/ascii-table3/ascii-table3.js:28:0`
  🤝 solved, still very hard to have native ascii table in react, may comeback to provide testcase for author

- remember to add status(200) to get the res to response from NextJs

- Example of converting ethers contract to typechain contract

```js
const autoCakePoolContract = getContract(
        autoCakePool.address,
        require("constants/abi/AutoCakePool.json"),
        provider
      ) as CakeSyrupPool;
```

- How to solve BNB bignumber get overflow error when call toNumber

```js
Number(userShares.shares.toString()
```

- Snippet to get floor price of pancake squad

```gql
query getNftsMarketData {
  nfts(
    where: {
      isTradable: true
      collection: "0x0a8901b0e25deb55a87524f0cc164e9644020eba"
    }
    first: 1
    orderBy: currentAskPrice
    orderDirection: asc
    skip: 0
  ) {
    tokenId
    metadataUrl
    currentAskPrice
    currentSeller
    latestTradedPriceInBNB
    tradeVolumeBNB
    totalTrades
    isTradable
    updatedAt
    otherId
    collection {
      id
    }
    transactionHistory {
      id
      block
      timestamp
      askPrice
      netPrice
      withBNB
      buyer {
        id
      }
      seller {
        id
      }
    }
  }
}
```

- The API to get coin price from coingecko seem slow down the app much, we kinda need to host it ourselves. Or we can think on applying cache ASAP