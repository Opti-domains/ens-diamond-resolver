import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  const diamondResolver = await ethers.getContract('DiamondResolver', owner)
  const publicResolver = await ethers.getContract('PublicResolver', owner)

  const selectors = [
    ethers.utils.id("ABI(bytes32,uint256)"),
    ethers.utils.id("addr(bytes32)"),
    ethers.utils.id("addr(bytes32,uint256)"),
    ethers.utils.id("clearRecords(bytes32)"),
    ethers.utils.id("contenthash(bytes32)"),
    ethers.utils.id("dnsRecord(bytes32,bytes32,uint16)"),
    ethers.utils.id("hasDNSRecords(bytes32,bytes32)"),
    ethers.utils.id("interfaceImplementer(bytes32,bytes4)"),
    ethers.utils.id("name(bytes32)"),
    ethers.utils.id("pubkey(bytes32)"),
    ethers.utils.id("recordVersions(bytes32)"),
    ethers.utils.id("setABI(bytes32,uint256,bytes)"),
    ethers.utils.id("setAddr(bytes32,uint256,bytes)"),
    ethers.utils.id("setAddr(bytes32,address)"),
    ethers.utils.id("setContenthash(bytes32,bytes)"),
    ethers.utils.id("setDNSRecords(bytes32,bytes)"),
    ethers.utils.id("setInterface(bytes32,bytes4,address)"),
    ethers.utils.id("setName(bytes32,string)"),
    ethers.utils.id("setPubkey(bytes32,bytes32,bytes32)"),
    ethers.utils.id("setText(bytes32,string,string)"),
    ethers.utils.id("setZonehash(bytes32,bytes)"),
    ethers.utils.id("text(bytes32,string)"),
    ethers.utils.id("zonehash(bytes32)"),
    ethers.utils.id('setABI(node,data)'),
  ]

  const facetCut = {
    target: publicResolver.address,
    action: 0, // ADD
    selectors: selectors
  }

  const supportInterfaces = [
    "0x2203ab56", // IABIResolver
    "0xf1cb7e06", // IAddressResolver
    "0x3b3b57de", // IAddrResolver
    "0xbc1c58d1", // IContentHashResolver
    "0xa8fa5682", // IDNSRecordResolver
    "0x5c98042b", // IDNSZoneResolver
    "0x124a319c", // IInterfaceResolver
    "0x691f3431", // INameResolver
    "0xc8690233", // IPubKeyResolver
    "0x59d1d43c", // ITextResolver
  ]

  await diamondResolver.diamondCut(
    [facetCut], 
    diamondResolver.address, 
    diamondResolver.interface.encodeFunctionData(
      "setMultiSupportsInterface",
      [
        supportInterfaces,
        true,
      ]
    )
  )
}

func.id = 'connect-public-resolver'
func.tags = []
func.dependencies = ['DiamondResolver', 'PublicResolverFacet']

export default func