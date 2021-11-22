import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './styles/style.css';
import './styles/nav.css'
import mintbg from './mintBackground.png';
import CoverFlow from 'coverflow-react';
import { Link } from 'react-scroll';

//Set your count down date
var countDownDate = new Date("Nov 22, 2021 14:00:00").getTime();

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const imagesArr = [
  'img/1.png',
  'img/2.png',
  'img/3.png',
  'img/4.png',
  'img/5.png',
  'img/6.png',
  'img/7.jpeg',
  'img/8.jpeg',
  'img/9.jpeg',
  'img/10.jpeg'
];
const labelsArr = [
  'hero-1',
  'hero-2',
  'hero-3',
  'hero-4',
  'hero-5',
  'hero-6',
  'hero-7',
  'hero-8',
  'hero-9',
  'hero-10'
]


export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--button);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
    &:disabled {
    cursor: default;
    opacity: 0.50;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--button);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 250px;
  @media (min-width: 767px) {
    width: 370px;
  }
  // margin-bottom: 80px;
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: none;
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledImgMain = styled.img`
  box-shadow: none;
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 200px;
  }
  transition: width 0.5s;
`;

export const StyledImgSocial = styled.img`
  width: 200px;
  display: flex;
`;

export const StyledLink = styled.a`
  color: var(--link);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Swift Fingers - The first 222 apes are available for FREE!`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimFREENFTs = () => {
    let cost = 0;
    let claimamount = 1;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * claimamount);
    let totalGasLimit = String(gasLimit * claimamount);
    console.log("Cost: FREE (Only pay gas) ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your FREE ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mintFREE(blockchain.account, claimamount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);



  
  var myfunc = setInterval(function() {
        
    var now = new Date().getTime();
    var timeleft = countDownDate - now;
        
    // Calculating the days, hours, minutes and seconds left
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        
    // Result is output to the specific element
    document.getElementById("days").innerHTML = days + "d "
    document.getElementById("hours").innerHTML = hours + "h " 
    document.getElementById("mins").innerHTML = minutes + "m " 
    document.getElementById("secs").innerHTML = seconds + "s " 
    document.getElementById('styledButton').style.pointerEvents = 'none';
        
    // Display the message when countdown is over
    if (timeleft < 0) {
        clearInterval(myfunc);
        document.getElementById("days").innerHTML = ""
        document.getElementById("hours").innerHTML = "" 
        document.getElementById("mins").innerHTML = ""
        document.getElementById("secs").innerHTML = ""
        document.getElementById("end").innerHTML = "CONNECT";
        document.getElementById('styledButton').style.pointerEvents = 'auto';

    }
    }, 1000);

  return (
    <s.Screen >
      <div class="nav">
        <input type="checkbox" id="nav-check" />
        <div class="nav-header">
          <div class="nav-title">
            <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />

          </div>
        </div>
        <div class="nav-btn">
          <label for="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <ul class="nav-links">

          <li><Link activeClass="active" to="mint" spy={true} smooth={true}>Mint</Link></li>
          <li><Link to="roadMap" spy={true} smooth={true}>RoadMap</Link></li>
          <li><Link to="ourTeam" spy={true} smooth={true}>Team</Link></li>
          <li><Link to="aboutUs" spy={true} smooth={true}>About</Link></li>

        </ul>

        <div className="nav-social">
          <a href="https://twitter.com" target="_blank" ><img className="nav-img" src="/twitter.png" /></a>
          <a href="https://discord.com" target="_blank" ><img className="nav-img" src="/discord.png" /></a>
        </div>
      </div>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ backgroundColor: "#000000", paddingTop: "14vh" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >

        <s.SpacerSmall />

        {/* <div className="social">
          <a href="https://twitter.com" target="_blank"><img src="/twitter.png" /></a>
          <a href="https://discord.com" target="_blank"><img src="/discord.png" /></a>
        </div> */}


        <div className="wrapper">
          <div style={{ backgroundImage: `url(${mintbg})`, backgroundSize: "cover" }} id='mint'>

            <div className="intro-text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.
            </div>

            <ResponsiveWrapper flex={1} style={{ padding: 24, alignItems: 'flex-start' }} test>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg alt={"example"} src={"/config/images/pic1.png"} />
                <s.TextTitle style={{ textAlign: "center", color: "var(--accent-text)" }}>
                  Aged Like Wine!
                  <s.SpacerSmall />
                </s.TextTitle>
                <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)" }}>
                  This is the home of 8.888 Senior apes that got too old sailing the "open sea" and needed a residence to retire. Find your son and be rewarded. Info in Discord.

                </s.TextDescription>
              </s.Container>

              <s.SpacerLarge />
              <s.Container
                flex={2}
                jc={"center"}
                ai={"center"}
                style={{
                  backgroundColor: "#03010fc9",
                  padding: 24,
                  borderRadius: 24,
                  border: "4px dashed var(--secondary)",
                  boxShadow: "none",
                }}
              >
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                  }}
                >
                  <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                    {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                  </StyledLink>
                </s.TextDescription>
                <StyledImgMain alt={"example"} src={"/config/images/example.gif"} />
                <s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 50,
                    fontWeight: "bold",
                    color: "var(--accent-text)",
                  }}
                >
                  {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                </s.TextTitle>
                <s.SpacerSmall />
                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                  <>
                    <s.TextTitle
                      style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                      The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription
                      style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                      You can still find {CONFIG.NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                      {CONFIG.MARKETPLACE}
                    </StyledLink>
                  </>
                ) : (
                  <>
                    <s.TextTitle
                      style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                      1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                      {CONFIG.NETWORK.SYMBOL}
                    </s.TextTitle>
                    <s.SpacerXSmall />
                    <s.TextDescription
                      style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                      Excluding gas fees
                    </s.TextDescription>
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                      <s.Container ai={"center"} jc={"center"}>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          Connect to the {CONFIG.NETWORK.NAME} network
                        </s.TextDescription>
                        <s.SpacerSmall />
                        <StyledButton id='styledButton'
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(connect());
                            getData();
                          }}
                        >
                          <span id="days"></span>
                          <span id="hours"></span>
                          <span id="mins"></span>
                          <span id="secs"></span>
                          <h2 id="end"></h2>
                        </StyledButton>
                        
                        {blockchain.errorMsg !== "" ? (
                          <>
                            <s.SpacerSmall />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {blockchain.errorMsg}
                            </s.TextDescription>
                          </>
                        ) : null}
                      </s.Container>
                    ) : (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {feedback}
                        </s.TextDescription>
                        <s.SpacerSmall />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>

                          <StyledButton
                            disabled={claimingNft ? 1 : 0}
                            disabled={data.totalSupply >= 200}
                            onClick={(e) => {
                              e.preventDefault();
                              claimFREENFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "MINTING" : "FREE MINT"}
                          </StyledButton>
                        </s.Container>
                        <s.SpacerMedium />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "MINTING" : "MINT"}
                          </StyledButton>
                        </s.Container>
                        <s.SpacerMedium />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {mintAmount}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerSmall />
                      </>
                    )}
                  </>
                )}
                <s.SpacerMedium />

              </s.Container>
              <s.SpacerLarge />
              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg alt={"example"} src={"/config/images/pic2.png"} />
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Pack your bananas and crayons
                  <s.SpacerSmall />
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  10 Senior Apes have a mysterious trait that will be announced in Discord. Ape will be able to vote in the destination or receive a 10.000$ compensation if you're are handicapped to travel.


                </s.TextDescription>
              </s.Container>
            </ResponsiveWrapper>

          </div>



          <div className="roadmap" id="roadMap">
            <h1>Roadmap</h1>
            <div className="roadmap-tree">
              <div className="roadmap-item">
                <h2>Q1 2022</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Ased do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div className="roadmap-item">
                <h2>Q2 2022</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.</p>
              </div>
              <div className="roadmap-item">
                <h2>Q3 2022</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim. Ased do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div className="roadmap-item">
                <h2>Q4 2022</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut dolore magna aliqua. Ut enim ad minim. Ased do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            </div>
          </div>

          <div className="team" id='ourTeam'>
            <h1>Team</h1>

            <div className="team-members">



              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>

              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>

              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>

              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>

              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>

              <div className="team-member">
                <div className="image"><img src="/avatar.png" /></div>
                <h2>Mr. Ape</h2>
                <h3>Chief Technology Officer</h3>
                <a href="https://www.twitter.com" target="_blank" className="social-link"><img src="/twitter.png" /></a>
              </div>






            </div>
          </div>


        </div>

        <section class="about" id="aboutUs">
          <div class="container">
            <div class="heading text-center">
              <h2>About
                <span></span></h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                <br />
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <img src="/aboutimg.png" alt="about" class="img-fluid" width="80%" />
              </div>
              <div class="col-lg-6">
                <h3>Lorem ipsum dolor sit amet, consectetur </h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.</p>
                <div class="row">
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>Awesome Design</h4>
                  </div>
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>
                      Creative Design</h4>
                  </div>
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>Better Client Service</h4>
                  </div>
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>
                      Digital Marketing & Branding</h4>
                  </div>
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>Creative Design</h4>
                  </div>
                  <div class="col-md-6">
                    <h4>
                      <i class="far fa-star"></i>
                      Speed And Flexibility</h4>
                  </div>
                </div>
                <a class="button-5" role="button" href="https://discord.com">Join our Discord</a>


              </div>
            </div>
          </div>
        </section>
        <h1 style={{
          marginTop: "40px",
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            color: "#fff",
            fontSize: "60px"
          }}>
            THE LEGENDARIES</h1>
        </h1>
        <span style={{ paddingInline: "10%" }}>

          <h1 style={{ fontSize: "35px", color: "orange" }}>Legendary Camels </h1>
          <p style={{ fontSize: "20px", marginBottom: "30px" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident doloribus autem voluptatibus explicabo sunt magnam impedit aut fugit temporibus ut totam, laudantium maxime cupiditate fugiat, aliquid a tenetur nisi? Temporibus.</p>
        </span>
        <CoverFlow imagesArr={imagesArr} labelsArr={labelsArr} direction="horizontal" 
          width="1495"
          height="399"
          itemRatio="6:6"
          background="black"
        />



        <s.SpacerMedium />

        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >

          </s.TextDescription>

          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >

          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen >
  );
}

export default App;
