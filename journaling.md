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
```
Applied cached, significant speed improvement
```
- Attach ntc search bar to app
```
LFG!
```

- Implement dropdown with style like search bar
```
https://stackoverflow.com/a/71843120/9814737
resolution in package json really help with the new type error of react 18

it is done, like nicely done haha
```

- Be careful when you trying to add border to children to act like its parent's border, it create hideous UI -> dont' waste time doing it

- Use built-in Image component for auto image optimization and some other better performance https://nextjs.org/docs/messages/no-img-element

- TODO: Show overall stats nesting details like table, make it 3 levels

- TODO: deploy to a vercel site 


- TODO: set up digital ocean, wiring them 2 both local and prod
  - add mongodb
  - add redis cache
```
- To fix "...from agent: agent refused operation" , run: `$ chmod 600 /home/<username>/.ssh/id_rsa` -> connected to digital ocean
```

- TypeError: String(...).replaceAll is not a function
```
method is not supported in some environment
how to fix: https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error
```

- Upload file and process in NextJs API
```
Disable default full body parser to allow request to come in the form of stream
Use next-connect so we can use middleware easier, it is made by a VNese!
use multer and store it in memory so that we don't have to store the file
after multer middleware, file will be attached to req.file and we can use it in our handler
the whole thing is pretty messy and need customized typing, but it works
```