import { createMedia } from "@artsy/fresnel";
import * as React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
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
} from "semantic-ui-react";
import { Colours } from "../styles/colours";
import Image from "next/image";

const ContractInteractionComponent = () => {
  const [account, setAccount] = useState<string>("");
  const [myraGenesis, setMyraGenesis] = useState<Contract>();
  const [loading, setloading] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>("0");

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
        <Image src={"/images/avatar/MyraFren00.png"} width={500} height={500} />
      </div>
      <ContractInteractionComponent />
    </Header>
  </Container>
);

const DesktopContainer: React.FunctionComponent = ({ children }) => {
  return (
    <Media greaterThan="mobile">
      <Segment
        textAlign="center"
        vertical
        style={{
          minHeight: 700,
          padding: "1em 0em",
          background: Colours.bgMain,
          border: "none",
          color: Colours.primaryText,
        }}
      >
        <Menu
          pointing
          secondary
          size="large"
          style={{
            border: "none",
          }}
        >
          <Container>
            <Menu.Item href="#" as="a">
              Home
            </Menu.Item>
            <Menu.Item href="#status-quo" as="a">
              Status Quo
            </Menu.Item>
            <Menu.Item href="#mission" as="a">
              Mission
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
              <a
                className="swing"
                href="#"
                target="_blank"
                style={{ marginLeft: "1em" }}
              >
                <img
                  alt="discord channel link"
                  src="/images/discord-icon.svg"
                />
              </a>
              <a
                className="swing"
                href="#"
                target="_blank"
                style={{ marginLeft: "1em" }}
              >
                <img
                  alt="our looksrare page"
                  src="/images/looksrare-icon.svg"
                />
              </a>
              <a
                className="swing"
                href="#"
                target="_blank"
                style={{ marginLeft: "1em" }}
              >
                <img alt="link to our twitter" src="/images/twitter-icon.svg" />
              </a>
              <a
                className="swing"
                href="#"
                target="_blank"
                style={{ marginLeft: "1em" }}
              >
                <img alt="our opensea page" src="/images/opensea-icon.svg" />
              </a>
            </Menu.Item>
          </Container>
        </Menu>
        <HomepageHeading />
      </Segment>

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
          <Menu.Item href="#status-quo" as="a">
            Status Quo
          </Menu.Item>
          <Menu.Item href="#mission" as="a">
            Mission
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

type Milestone = {
  percent: number;
  label: string;
};
const milestones: Milestone[] = [
  {
    percent: 10,
    label: "Pay back those who believed in us",
  },
  {
    percent: 20,
    label: "Every Myra Fren needs a companion. Building community",
  },
  {
    percent: 40,
    label:
      "Donation to Hackney Empire: youth project, the Royal Albert hall of urban and alternative culture in London",
  },
  {
    percent: 50,
    label: "IRL event mixing sound installation with art curation",
  },
  {
    percent: 75,
    label: "Giving Back to our community Frens",
  },
  {
    percent: 100,
    label: "Myra Frens L2E platform",
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
        <strong>How many Myra Frens are there?</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <p style={{ fontSize: "1.15em", marginLeft: 30 }}>
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
        <strong>How much will Myra Frens cost to mint?</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <p style={{ fontSize: "1.15em", marginLeft: 30 }}>0.05 ETH</p>
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
        style={{ fontSize: "1.33em" }}
      >
        <Icon name="dropdown" />
        <strong>Wens Mint?</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 2}>
        <p style={{ fontSize: "1.15em", marginLeft: 30 }}>
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
        <strong>Will there be utility?</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 3}>
        <p style={{ fontSize: "1.15em", marginLeft: 30 }}>
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
        <strong>Where does my NFT go after I purchase a Myra Fren?</strong>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 4}>
        <p style={{ fontSize: "1.15em", marginLeft: 30 }}>
          Your Myra Frens NFT will appear in the connected wallet you used to
          purchase your fren.
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

type TeamMember = {
  name: string;
  twitter: string;
  position: string;
  image: string;
};

const team: TeamMember[] = [
  {
    name: "Henley",
    twitter: "@0xBeckford",
    position: "Founder and Director of Product & Innovation",
    image: "/images/avatar/MyraTeam01.jpg",
  },
  {
    name: "Naomi",
    twitter: "@The_Odyssean",
    position: "Creative Director & Community Lead",
    image: "/images/avatar/MyraTeam02.jpg",
  },
  {
    name: "Adilson",
    twitter: "@AMBacelar",
    position: "Co-founder and Head of Technology",
    image: "/images/avatar/MyraTeam03.jpg",
  },
  {
    name: "Richard",
    twitter: "@KingRichyArt",
    position: "Illustration & Design",
    image: "/images/avatar/MyraTeam04.jpg",
  },
  {
    name: "Shallu",
    twitter: "@tbc",
    position: "Lead Games artist & Illustrator",
    image: "/images/avatar/MyraFren00.png",
  },
  {
    name: "Anna",
    twitter: "@tbc",
    position: "Lead Games designer",
    image: "/images/avatar/MyraFren00.png",
  },
  {
    name: "Ali",
    twitter: "@tbc",
    position: "Lead Games developers",
    image: "/images/avatar/MyraFren00.png",
  },
];

const TeamSection = () => {
  const cards = team.map((teamMember) => (
    <div className="teamMember">
      <div>
        <Image
          style={{ borderRadius: 200 }}
          src={teamMember.image}
          width={200}
          height={200}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <strong>{teamMember.position}</strong>
        <p>{teamMember.name}</p>
        <p>{teamMember.twitter}</p>
      </div>
    </div>
  ));
  return <div id="teamSectionWrapper">{cards}</div>;
};

const HomepageLayout = () => {
  return (
    <ResponsiveContainer>
      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="status-quo"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            THE STATUS QUO
          </Header>
          <p style={{ fontSize: "1.33em", textAlign: "center" }}>
            Digitising education has failed, the frenzy during covid 19
            uncovered that institutions and educators could not scale their
            platforms to effectively add value to the world, in crisis and are
            struggling in keep to their promises in recent times.
            <br />
            <br />
            Cultural arts institutions are dinosaurs, during the lengthy
            lockdowns their lack of display of digital experiences forced
            museums, theatres and galleries to face extreme hardship and debt,
            costing the state 100s of millions, globally.
            <br />
            <br />
            Whilst being a pillar to their communities, and with no sole fault
            of their own, in the moment of need, they missed a pivotal moment to
            authentically connect & support the ‘communities’ they act as
            ambassadors for.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Image
              src="/images/avatar/MyraFren01.jpg"
              width="150"
              height="150"
              style={{ marginLeft: 50, marginRight: 50 }}
            />
            <Image
              src="/images/avatar/MyraFren02.jpg"
              width="150"
              height="150"
              style={{ marginLeft: 50, marginRight: 50 }}
            />
            <Image
              src="/images/avatar/MyraFren03.jpg"
              width="150"
              height="150"
              style={{ marginLeft: 50, marginRight: 50 }}
            />
            <Image
              src="/images/avatar/MyraFren04.jpg"
              width="150"
              height="150"
              style={{ marginLeft: 50, marginRight: 50 }}
            />
          </div>
        </Container>
      </Segment>

      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="mission"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            Mission
          </Header>
          <p style={{ fontSize: "1.33em", textAlign: "center", marginTop: 30 }}>
            We are on the mission to provide free access and education of our
            enriched history of cultural arts, heritage and enterprise.
            Reinvigorating how we educate our communities about
            entrepreneurship, arts & culture to enhance social equity, social
            equality and listening, all whilst empowering ourselves. And by
            empowering ourselves, we empower our communities, uniting
            traditional cultural arts with the digital world to create
            extraordinary experiences.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Image
              src="/images/avatar/MyraFren05.jpg"
              width="150"
              height="150"
              style={{ marginLeft: 50, marginRight: 50 }}
            />
          </div>
        </Container>
      </Segment>

      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="join-solar"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            Join the Solar
          </Header>
          <p style={{ fontSize: "1.33em", textAlign: "center", marginTop: 30 }}>
            Unlock your hidden value with a Myra Fren. Each Fren provides a key
            to a solar platform that rewards its owner for establishing their
            own unique identity.
            <br />
            <br />
            Myra Frens are a collection of 10,988 auto-generated and culturally
            curated NFTs living on the Ethereum Blockchain.
          </p>
        </Container>
      </Segment>

      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="roadmap"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            ROADMAP
          </Header>
          <p style={{ fontSize: "1.33em", textAlign: "center" }}>coming soon</p>
        </Container>
      </Segment>

      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
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

      <Segment style={{ padding: "4em 0em", border: "none" }} vertical>
        <Container text>
          <Header
            as="h3"
            id="team"
            style={{ fontSize: "2.5em", textAlign: "center", marginBottom: 40 }}
          >
            TEAM
          </Header>
          <TeamSection />
        </Container>
      </Segment>

      <Segment
        vertical
        style={{ padding: "5em 0em", border: "none", textAlign: "center" }}
      >
        <Container text>
          <div
            style={{ padding: "5em 0em", border: "none", textAlign: "center" }}
          >
            <a href="#" target="_blank" style={{ marginLeft: "1em" }}>
              <img alt="discord channel link" src="/images/discord-icon.svg" />
            </a>
            <a href="#" target="_blank" style={{ marginLeft: "1em" }}>
              <img alt="our looksrare page" src="/images/looksrare-icon.svg" />
            </a>
            <a href="#" target="_blank" style={{ marginLeft: "1em" }}>
              <img alt="link to our twitter" src="/images/twitter-icon.svg" />
            </a>
            <a href="#" target="_blank" style={{ marginLeft: "1em" }}>
              <img alt="our opensea page" src="/images/opensea-icon.svg" />
            </a>
          </div>
          <p style={{ fontSize: "1.33em" }}>
            ©{new Date().getFullYear()} Myra Frens
          </p>
          <p style={{ fontSize: "1.33em" }}>Logo again?</p>
          <a
            href={`https://etherscan.io/address/${MYRA_GENESIS_ADDRESS}`}
            target="_blank"
          >
            Etherscan: {MYRA_GENESIS_ADDRESS}
          </a>
        </Container>
      </Segment>
    </ResponsiveContainer>
  );
};

export default HomepageLayout;
