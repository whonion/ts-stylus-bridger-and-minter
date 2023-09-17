[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/whonion/ts-stylus-bridger-and-minter/blob/main/) [![Build TS](https://github.com/whonion/ts-stylus-bridger-and-minter/actions/workflows/build.yml/badge.svg)](https://github.com/whonion/ts-stylus-bridger-and-minter/actions/workflows/test.yml) ![Node Version](https://img.shields.io/badge/Node.js-20.6.1-blue.svg) ![Ethers Version](https://img.shields.io/badge/ethers-5.7.2-red.svg) [![HitCount](https://hits.dwyl.com/whonion/ts-stylus-bridger-and-minter.svg)](https://hits.dwyl.com/whonion/ts-stylus-bridger-and-minter)</br>
## arbitrum-stylus-bridger-and-minter
TypeScript impelementation of Arbitrum Stylus Testnet Bridger and Omnibase NFT minter

`main.js` preview <br>![ts-stylus-bridger-and-minter](https://github.com/whonion/ts-stylus-bridger-and-minter/blob/main/.github/preview.png?raw=true)<br>

### Install `Node.js`
```sh
sudo apt install git
sudo apt install nodejs
sudo apt install npm
node -v
npm -v
```
### Clone repo and install dependencies
```sh
git clone https://github.com/whonion/ts-stylus-bridger-and-minter.git
cd ts-stylus-bridger-and-minter
npm i
npm i -g typescript
tsc --project tsconfig.json

```
## What's do script ?
### Bridge Funds
 - Bridge Funds from Sepolia Testnet to Arbitrum Sepolia via [bridge.arbitrum.io](https://bridge.arbitrum.io)
 - Bridge Funds from Arbitrum Sepolia to Arbitrum Stylus Testnet via [bridge.arbitrum.io](https://bridge.arbitrum.io)
 - Mint Omnibase NFT (Powered by Layer Zero) to Arbitrum Stylus
## Run Script
```sh
node main.js
```
