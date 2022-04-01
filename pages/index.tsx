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
  Container,
  Header,
  Icon,
  Menu,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react";

const ContractInteractionComponent = () => {
  const [account, setAccount] = useState<string>("");
  const [myraGenesis, setMyraGenesis] = useState<Contract>();
  const [loading, setloading] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<number>(1);
  const [minted, setMinted] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

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
    const web3 = new Web3((window as any).ethereum);
    myraGenesis &&
      (await myraGenesis.methods.mint(account, 1).send({
        from: account,
        value: parseInt(await myraGenesis.methods.cost().call()) * tokenAmount,
      }));
    setloading(false);
  };

  const MintInteractionComponent = () => {
    if (account && myraGenesis) {
      console.log({ account, myraGenesis });
      return (
        <>
          <p>Your Account: {account} on the Rinkeby test network</p>
          <Button
            // disabled={loading}
            loading={loading}
            onClick={() => handleMintClick()}
          >
            Mint {tokenAmount} token(s)
          </Button>
        </>
      );
    }

    return <></>;
  };

  return (
    <>
      <p>
        Currently at {minted} out of {totalSupply} minted
      </p>
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
    <Header inverted>
      <h1
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal",
          marginBottom: 100,
          marginTop: mobile ? "1.5em" : "3em",
        }}
      >
        Myra Learning
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
          inverted
          textAlign="center"
          style={{ minHeight: 700, padding: "1em 0em" }}
          vertical
        >
          <Menu
            fixed={showFixedMenu ? "top" : undefined}
            inverted={!showFixedMenu}
            pointing={!showFixedMenu}
            secondary={!showFixedMenu}
            size="large"
          >
            <Container>
              <Menu.Item href="#" as="a">
                Home
              </Menu.Item>
              <Menu.Item href="#about" as="a">
                About
              </Menu.Item>
              <Menu.Item href="#mission" as="a">
                Mission
              </Menu.Item>
              <Menu.Item href="#roadmap" as="a">
                Roadmap
              </Menu.Item>
              <Menu.Item href="#team" as="a">
                Team
              </Menu.Item>
              <Menu.Item position="right">
                <Button as="a" inverted={!showFixedMenu}>
                  Twitter
                </Button>
                <Button
                  as="a"
                  inverted={!showFixedMenu}
                  style={{ marginLeft: "0.5em" }}
                >
                  Discord
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
          inverted
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
          <Menu.Item href="#mission" as="a">
            Mission
          </Menu.Item>
          <Menu.Item href="#roadmap" as="a">
            Roadmap
          </Menu.Item>
          <Menu.Item href="#team" as="a">
            Team
          </Menu.Item>
          <Menu.Item as="a">Twitter</Menu.Item>
          <Menu.Item as="a">Discord</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 350, padding: "1em 0em" }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size="large">
                <Menu.Item onClick={() => setSidebarOpened(!sidebarOpened)}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a" inverted>
                    Twitter
                  </Button>
                  <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
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

const HomepageLayout = () => {
  return (
    <ResponsiveContainer>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" id="about" style={{ fontSize: "2em" }}>
            About
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Myra Frens are a collection of 10,000 randomly generated and
            culturally curated NFTs living on the Ethereum Blockchain. Each Fren
            is on a mission to tell a story of our enriched culture, arts and
            enterprise with a focus on community and social equity.
          </p>
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" id="mission" style={{ fontSize: "2em" }}>
            Our foundation and mission
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            When my son was 11 months old, his mother and my long term partner
            passed away. After his safety and health; education, culture and
            identity became a main focal point for me.
          </p>
          <p style={{ fontSize: "1.33em" }}>
            “Who am I?”
            <br />
            “Who is he?”
            <br />
            “Who are we?”…
          </p>

          <p style={{ fontSize: "1.33em" }}>
            These questions got me thinking about how to find ways to
            communicate, educate and capture the essence of all our cultures, in
            meaningful ways, keeping our identities alive.
          </p>

          <hr />

          <p style={{ fontSize: "1.33em" }}>
            Whilst exploring this thought process, I learned a few things along
            the way:
          </p>

          <ul style={{ fontSize: "1.33em" }}>
            <li>
              In the UK alone, almost 1 in 3 children are born to at least 1
              foreign born parent
            </li>
            <li>
              14.9% of our population will come from a single parent household.
            </li>
            <li>
              Learning about culture and history is mostly academic and
              expensive.
            </li>
            <li>
              Underserved communities are 80x less likely to have access to
              cultural arts organisations and academic institutions -
              post-compulsory schooling.
            </li>
            <li>
              Parents from lower socioeconomic backgrounds are significantly
              less likely to teach and/or take their children to arts or
              cultural and historical events, creating an isolated ‘cycle of
              culture’.
            </li>
          </ul>

          <p style={{ fontSize: "1.33em" }}>
            If this is happening within the multicultural melting pot of what
            that is the U.K. Imagine scaling this problem across the rest of the
            world…{" "}
          </p>

          <p style={{ fontSize: "1.33em" }}>
            We are on the mission to bridge the gap of culture, social equity
            and web 3 technology for all. Giving back to those who add value to
            the world but not recognised in the midst of all the noise.
          </p>
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" id="roadmap" style={{ fontSize: "2em" }}>
            Roadmap
          </Header>
          <RoadmapProgress milestones={milestones} />
        </Container>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" id="team" style={{ fontSize: "2em" }}>
            Founding team
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            this is where our own custom Myra Frens avatars will sit
          </p>
        </Container>
      </Segment>

      <Segment inverted vertical style={{ padding: "5em 0em" }}>
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
