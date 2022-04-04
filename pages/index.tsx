import { createMedia } from "@artsy/fresnel";
import * as React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import RoadmapProgress from "react-roadmap-progress";
import { MYRA_GENESIS_ADDRESS, MYRA_GENESIS_ABI } from "../config";
import {
  Button,
  Accordion,
  Container,
  Header,
  Icon,
  Input,
  Menu,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react";
import { Colours } from "../styles/colours";
import Image from "next/image";
import mcLogo from "../public/images/mclogo.png";

const ContractInteractionComponent = () => {
  const [account, setAccount] = useState<string>("");
  const [myraGenesis, setMyraGenesis] = useState<Contract>();
  const [loading, setloading] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [minted, setMinted] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);

  useEffect(() => {
    if ((window as any).ethereum) {
      const web3 = new Web3((window as any).ethereum);
      try {
        const isRinkeby = web3.eth.net.getId();
        if (isRinkeby) {
          const mGenesisContractList = new web3.eth.Contract(
            MYRA_GENESIS_ABI as AbiItem[],
            MYRA_GENESIS_ADDRESS
          );
          setMyraGenesis(mGenesisContractList);
          const fetchContractConstants = async () => {
            const totalSupply = await mGenesisContractList.methods
              .maxSupply()
              .call();
            const minted = await mGenesisContractList.methods
              .totalSupply()
              .call();

            setTotalSupply(totalSupply);
            setMinted(minted);
          };
          fetchContractConstants();
        } else {
          console.error("Not on Rinkeby Test Network");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const handleConnectWalletClick = async () => {
    if ((window as any).ethereum) {
      const web3 = new Web3((window as any).ethereum);
      try {
        await (window as any).ethereum.enable();
        const isRinkeby = web3.eth.net.getId();
        if (isRinkeby) {
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          console.error("Not on Rinkeby Test Network");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMintClick = async () => {
    setloading(true);
    try {
      const web3 = new Web3((window as any).ethereum);
      myraGenesis &&
        (await myraGenesis.methods.mint(account, 1).send({
          from: account,
          value:
            parseInt(await myraGenesis.methods.cost().call()) *
            parseInt(tokenAmount),
        }));
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const MintInteractionComponent = () => {
    if (account && myraGenesis) {
      console.log({ account, myraGenesis });
      return (
        <>
          <p>Your Account: {account} on the Rinkeby test network</p>
          <Input
            type="number"
            min={1}
            max={5}
            defaultValue={tokenAmount}
            onBlur={(e) => setTokenAmount(e.target.value)}
            action={{
              loading: loading,
              disabled: !tokenAmount,
              content: `Mint ${parseInt(tokenAmount)} token(s)`,
              onClick: () => handleMintClick(),
            }}
          />
        </>
      );
    }

    return <></>;
  };

  return (
    <>
      {/* <p>
        Currently at {minted} out of {totalSupply} minted
      </p> */}
      {account ? (
        <MintInteractionComponent />
      ) : (
        <Button onClick={() => handleConnectWalletClick()}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

const HomepageHeading = ({ mobile }: { mobile?: boolean }) => (
  <Container text>
    <Header>
      <div style={{ marginTop: mobile ? "1.5em" : "3em" }}>
        <Image src={mcLogo} width={200} height={200} />
      </div>
      <h1
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal",
          marginBottom: 100,
          color: Colours.primaryText,
        }}
      >
        Myra Frens
      </h1>
      <ContractInteractionComponent />
    </Header>
  </Container>
);

const DesktopContainer: React.FunctionComponent = ({ children }) => {
  const [showFixedMenu, setShowFixedMenu] = useState(false);
  return (
    <Media greaterThan="mobile">
      <Visibility
        once={false}
        onBottomPassed={() => setShowFixedMenu(true)}
        onBottomPassedReverse={() => setShowFixedMenu(false)}
      >
        <Segment
          textAlign="center"
          style={{
            minHeight: 700,
            padding: "1em 0em",
            background: Colours.bgMain,
            border: "none",
            color: Colours.primaryText,
          }}
          vertical
        >
          <Menu
            fixed={showFixedMenu ? "top" : undefined}
            pointing={!showFixedMenu}
            secondary={!showFixedMenu}
            size="large"
            style={{
              border: "none",
            }}
          >
            <Container>
              <Menu.Item href="#" as="a">
                Home
              </Menu.Item>
              <Menu.Item href="#about" as="a">
                About
              </Menu.Item>
              <Menu.Item href="#roadmap" as="a">
                Roadmap
              </Menu.Item>
              <Menu.Item href="#faq" as="a">
                FAQ
              </Menu.Item>
              <Menu.Item href="#team" as="a">
                Team
              </Menu.Item>
              <Menu.Item position="right">
                <Button as="a" style={{ marginLeft: "0.5em" }}>
                  Discord
                </Button>
                <Button as="a" style={{ marginLeft: "0.5em" }}>
                  Twitter
                </Button>
                <Button as="a" style={{ marginLeft: "0.5em" }}>
                  OpenSea
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading />
        </Segment>
      </Visibility>

      {children}
    </Media>
  );
};

const MobileContainer: React.FunctionComponent = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  return (
    <Media at="mobile">
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="overlay"
          onHide={() => setSidebarOpened(false)}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item href="#" as="a">
            Home
          </Menu.Item>
          <Menu.Item href="#about" as="a">
            About
          </Menu.Item>
          <Menu.Item href="#roadmap" as="a">
            Roadmap
          </Menu.Item>
          <Menu.Item href="#faq" as="a">
            FAQ
          </Menu.Item>
          <Menu.Item href="#team" as="a">
            Team
          </Menu.Item>
          <Menu.Item as="a">Discord</Menu.Item>
          <Menu.Item as="a">Twitter</Menu.Item>
          <Menu.Item as="a">OpenSea</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign="center"
            style={{
              minHeight: 350,
              padding: "1em 0em",
              background: Colours.bgMain,
              border: "none",
            }}
            vertical
          >
            <Container>
              <Menu pointing secondary size="large">
                <Menu.Item onClick={() => setSidebarOpened(!sidebarOpened)}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a">Twitter</Button>
                  <Button as="a" style={{ marginLeft: "0.5em" }}>
                    Discord
                  </Button>
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Media>
  );
};

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const ResponsiveContainer: React.FunctionComponent = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

const milestones = [
  {
    title: "10%",
    version: "0.0.1",
    description: "Pay back those who believed in us",
    complete: true,
  },
  {
    title: "20%",
    version: "0.0.2",
    description: "Every Myra Fren needs a companion. Building community",
    complete: true,
  },
  {
    title: "40%",
    version: "0.0.3",
    description:
      "Donation to Hackney Empire: youth project, the Royal Albert hall of urban and alternative culture in London",
    complete: false,
  },
  {
    title: "50%",
    version: "0.0.4",
    description: "IRL event mixing sound installation with art curation",
    complete: false,
  },
  {
    title: "75%",
    version: "0.0.5",
    description: "Giving Back to our community Frens",
    complete: false,
  },
  {
    title: "100%",
    version: "0.0.6",
    description: "Myra Frens L2E platform",
    complete: false,
  },
];

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <Accordion>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        How many Myra Frens are there?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <p style={{ fontSize: "1.33em" }}>
          There will be a collection of 10,000 generative NFTS.
        </p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 1}
        index={1}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        How much will Myra Frens cost to mint?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <p style={{ fontSize: "1.33em" }}>0.05 ETH</p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        When is the Mint?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 2}>
        <p style={{ fontSize: "1.33em" }}>
          Our mint date will be announced closer to the mint time, follow our
          Twitter account for further information.
        </p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 3}
        index={3}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        Will there be utility?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 3}>
        <p style={{ fontSize: "1.33em" }}>
          Owners of Myra Frens will be able to access a cultural platform in
          order to explore, learn and build within the Myra ecosystem.
        </p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 4}
        index={4}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        Where does my NFT go after I purchase a Myra Fren?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 4}>
        <p style={{ fontSize: "1.33em" }}>
          Your Myra Frens NFT will appear in the connected wallet you used to
          purchase your fren.
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

const HomepageLayout = () => {
  return (
    <ResponsiveContainer>
      <Segment style={{ padding: "8em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="about"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            ABOUT
          </Header>
          <p style={{ fontSize: "1.33em", textAlign: "center" }}>
            Myra Frens are a collection of 10,000 randomly generated and
            culturally curated NFTs living on the Ethereum Blockchain.
          </p>
          <p style={{ fontSize: "1.33em", textAlign: "center", color: "red" }}>
            a row of images (emaple NFTs)
          </p>
          <p style={{ fontSize: "1.33em", textAlign: "center" }}>
            Each Fren provides a key to a cultual platform that rewards users
            for exploring, learning and building. Our mission is to bridge the
            gap of culture, social equity and web3 technology for all. Giving
            back to those who add value to the world.
          </p>
          <p style={{ fontSize: "1.33em", textAlign: "center", color: "red" }}>
            a single image (emaple NFT)
          </p>
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="roadmap"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            ROADMAP
          </Header>
          <RoadmapProgress milestones={milestones} />
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="faq"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            FAQ
          </Header>
          <FaqAccordion />
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="team"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            FOUNDING TEAM
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            this is where our own custom Myra Frens avatars will sit
          </p>
        </Container>
      </Segment>

      <Segment vertical style={{ padding: "5em 0em", border: "none" }}>
        <Container text>
          <p style={{ fontSize: "1.33em" }}>
            this is where all our social links will sit
          </p>
          <p style={{ fontSize: "1.33em" }}>© 2022 Myra Frens</p>
          <p style={{ fontSize: "1.33em" }}>Logo again?</p>
        </Container>
      </Segment>
    </ResponsiveContainer>
  );
};

export default HomepageLayout;
