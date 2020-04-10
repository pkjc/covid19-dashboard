import React, { useState, useEffect } from "react";

import * as L from "leaflet";
import axios from "axios";
import Layout from "components/Layout";
import Map from "components/Map";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import countyLocationData from "../data/county-latlong";
import { isYesterday, isToday } from "../lib/util";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import Card from "react-bootstrap/Card";
import cheerio from "cheerio";
import Metadata from "../components/Metadata";

const DEFAULT_ZOOM = 7;
const INDIA_DATA_API = "https://api.covid19india.org/state_district_wise.json";
// const INDIA_DAILY_DATA = "https://api.covid19india.org/states_daily.json";
const USA_DATA_API =
  "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
const supportedLocations = ["maharashtra", "michigan"];

// let stateNeighborMap = new Map();
// const  mhLocation = {
//   leftBoundLoc: "Milwaukee, Wisconsin",
//   rightBoundLoc: "London, Ontario"
// }
// const  miLocation = {
//   leftBoundLoc: "Milwaukee, Wisconsin",
//   rightBoundLoc: "London, Ontario"
// }
// stateNeighborMap.set("maharashtra", mhLocation);
// stateNeighborMap.set("michigan", miLocation);
const miLeftBound = [44.5133, -88.015831];
const miRightBound = [43.39722, -80.311386];
const miCenter = [44.314842, -85.602364];
// const miBounds = L.latLngBounds([miLeftBound, miRightBound]);

const mhLeftBound = [21.203502, 72.839233];
const mhRightBound = [19.089769, 82.02153];
const mhCenter = [19.75148, 75.71389];
// const mhBounds = L.latLngBounds([mhLeftBound, mhRightBound]);

const IndexPage = () => {
  const [countyData, setCountyData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [mhNews, setMhNews] = useState([]);
  const [miNews, setMiNews] = useState([]);
  const [miStats, setMiStats] = useState({});
  const [mhStats, setMhStats] = useState({});
  // const [mhMapBounds, setMhMapBounds] = useState({});
  // const [miMapBounds, setMiMapBounds] = useState({});

  useEffect(() => {
    buildMiData(USA_DATA_API, setCountyData);
    buildMhData(INDIA_DATA_API, setCityData, setMhStats);
    fetchNewsFor(supportedLocations[0], setMhNews);
    fetchNewsFor(supportedLocations[1], setMiNews);
    fetchCaseCounts(setMiStats);
  }, []);

  async function miMapEffect({ leafletElement: map } = {}) {
    const hasData = Array.isArray(countyData) && countyData.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: "FeatureCollection",
      features: countyData.map((countyInfo = {}) => {
        let { lat, lng } = countyInfo;
        if (!lat || !lng) {
          lat = 0.0;
          lng = 0.0;
        }
        return {
          type: "Feature",
          properties: countyInfo,
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      }),
    };

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;

        let updatedFormatted;
        let casesString;

        const { county, cases, date } = properties;
        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        if (date) {
          updatedFormatted = new Date(date).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${county} County</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });

    geoJsonLayers.addTo(map);
  }

  async function mhMapEffect({ leafletElement: map } = {}) {
    const hasData = Array.isArray(cityData) && cityData.length > 0;

    if (!hasData) return;

    const geoJson = getGeoJson(cityData);

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const { city, confirmed: cases } = properties;

        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }
        let updated = new Date();
        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${city}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });

    geoJsonLayers.addTo(map);
  }

  const miMapSettings = {
    center: miCenter,
    // bounds: miBounds,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    mapEffect: miMapEffect,
  };

  const mhMapSettings = {
    center: mhCenter,
    // bounds: mhBounds,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    mapEffect: mhMapEffect,
  };

  return (
    <Layout pageName="home">
      <Metadata />
      <Container fluid>
        <Row lg={2} xs={1}>
          <Col>
            <Row>
              <Col className={"my-sm-2  my-2"}>
                <Card as="h4" style={{ textAlign: "center" }} body>
                  Michigan Cases
                </Card>
                <Map {...miMapSettings} style={{ height: "60vh" }} />
              </Col>
            </Row>
            <Row lg={2} xs={1}>
              <Col xs={{ order: 12 }} className={"my-sm-2  my-2"}>
                <Card bg="Dark" text="dark">
                  <Card.Header as="h4">Michigan News</Card.Header>
                  <ListGroup variant="flush">
                    {miNews &&
                      miNews.length > 0 &&
                      miNews.map((newsItem, i) => {
                        return (
                          <ListGroup.Item key={i} style={{ padding: ".2em" }}>
                            <Button
                              variant="link"
                              style={{ textAlign: "left", fontSize: "1.1em" }}
                              href={newsItem.link}
                            >
                              {newsItem.title}
                            </Button>
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>
                </Card>
              </Col>
              <Col lg={{ order: 12 }} className={"my-sm-2  my-2"}>
                <Card bg="Dark" text="dark">
                  <Card.Header as="h4">Statistics</Card.Header>
                  <Card.Body>
                    <Card.Title as="h3">
                      Total Count: {miStats["casesTotal"]}
                    </Card.Title>
                    <hr />
                    <Card.Title as="h3">
                      Oakland CT Cases: {miStats["casesOakland"]}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className={"my-sm-2  my-2"}>
                <Card as="h4" style={{ textAlign: "center" }} body>
                  Maharashtra Cases
                </Card>
                <Map {...mhMapSettings} style={{ height: "60vh" }} />
              </Col>
            </Row>
            <Row lg={2} xs={1}>
              <Col xs={{ order: 12 }} className={"my-sm-2  my-2"}>
                <Card bg="Dark" text="dark">
                  <Card.Header as="h4">Maharashta News</Card.Header>
                  <ListGroup variant="flush">
                    {mhNews &&
                      mhNews.length > 0 &&
                      mhNews.map((newsItem, i) => {
                        return (
                          <ListGroup.Item key={i} style={{ padding: ".2em" }}>
                            <Button
                              variant="link"
                              style={{ textAlign: "left", fontSize: "1.1em" }}
                              href={newsItem.link}
                            >
                              {newsItem.title}
                            </Button>
                          </ListGroup.Item>
                        );
                      })}
                  </ListGroup>
                </Card>
              </Col>
              <Col lg={{ order: 12 }} className={"my-sm-2  my-2"}>
                <Card bg="Dark" text="dark">
                  <Card.Header as="h4">Statistics</Card.Header>
                  <Card.Body>
                    <Card.Title as="h3">
                      Total Count: {mhStats["casesTotal"]}
                    </Card.Title>
                    <hr />
                    <Card.Title as="h3">
                      Pune Cases: {mhStats["casesPune"]}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default IndexPage;

function fetchCaseCounts(setMiStats) {
  axios
    .get(
      "https://cors-anywhere.herokuapp.com/https://www.michigan.gov/coronavirus/0,9753,7-406-98163_98173---,00.html"
    )
    .then((res) => {
      const $ = cheerio.load(res.data);
      let miStat = {};
      miStat["casesTotal"] = $(
        ".fullContent > table > tbody > tr:nth-child(79) > td:nth-child(2) > strong"
      ).text();
      miStat["casesOakland"] = $(
        ".fullContent > table > tbody > tr:nth-child(55) > td:nth-child(2)"
      ).text();
      setMiStats(miStat);
    });
}

async function fetchNewsFor(location, setNews) {
  let baseUrl =
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D";
  let urlSuffix = "%2Bcoronavirus%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen";

  let url = baseUrl + location + urlSuffix;
  let response = await fetch(url);
  let data = await response.json();

  return setNews(data["items"].slice(0, 6));
}

function getGeoJson(data) {
  return {
    type: "FeatureCollection",
    features: data.map((city = {}) => {
      let { lat, lng } = city[Object.keys(city)[0]];
      if (!lat || !lng) {
        lat = 0.0;
        lng = 0.0;
      }
      return {
        type: "Feature",
        properties: {
          ...city[Object.keys(city)[0]],
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
    }),
  };
}

// function fetchLatLongFromApi(cities) {
//   let inputArray = [];

//   cities.forEach((k) => {
//     console.log(k);
//     inputArray.push(Object.keys(k)[0] + ", " + "Maharashtra");
//   });
//   console.log(inputArray);
//   // newFunction_1(inputArray);
// }

function addLatLongToCities(cities, setCityData) {
  let ind = -1;
  cities.forEach((k) => {
    ind = countyLocationData.findIndex(
      (item) => item.county.split(",")[0].trim() === Object.keys(k)[0]
    );
    if (ind > 0) {
      k[Object.keys(k)[0]]["lat"] = countyLocationData[ind]["lat"];
      k[Object.keys(k)[0]]["lng"] = countyLocationData[ind]["lng"];
      k[Object.keys(k)[0]]["city"] = Object.keys(k)[0];
    }
  });
  setCityData(cities);
}

async function buildMhData(INDIA_DATA_API, setCityData, setMhStats) {
  let response;
  try {
    response = await axios.get(INDIA_DATA_API);
  } catch (e) {
    console.log(`Failed to fetch countries: ${e.message}`, e);
    return;
  }
  const cities = [];
  const districtData = response["data"]["Maharashtra"]["districtData"];
  let total = 0;
  let pune = 0;
  let mhStat = {};
  for (let city in districtData) {
    total += parseInt(districtData[city]["confirmed"]);
    if (city === "Pune") pune = parseInt(districtData[city]["confirmed"]);
    cities.push({ [city]: districtData[city] });
  }
  mhStat["casesTotal"] = total;
  mhStat["casesPune"] = pune;
  setMhStats(mhStat);
  addLatLongToCities(cities, setCityData);
}

// async function getMapBoundsFor(location, setMapBounds) {

//   let mapBoundsForStates = [
//     {
//       centerLatLng: [0.0, 0.0],
//       leftBoundLatLng: [0.0, 0.0],
//       rightBoundLatLng: [0.0, 0.0],
//     },
//   ];

//   let inputArray = [];
//   inputArray.push(location);
//   inputArray.push(stateNeighborMap(location)["leftBoundLoc"]);
//   inputArray.push(stateNeighborMap(location)["rightBoundLoc"]);

function buildMiData(STATE_COUNTIES_API, setCountyData) {
  let countyDataFromApi = [];
  Papa.parse(STATE_COUNTIES_API, {
    download: true,
    header: true,
    complete: function(results, file) {
      countyDataFromApi = results.data.filter((item) => {
        return (
          (isToday(new Date(item["date"])) && item["state"] === "Michigan") ||
          (isYesterday(new Date(item["date"])) && item["state"] === "Michigan")
        );
      });

      countyDataFromApi.forEach((countyFromApi) => {
        let ind = countyLocationData.findIndex(
          (cLocData) =>
            cLocData.county.split(",")[0].trim() === countyFromApi.county
        );
        if (ind > 0) {
          countyFromApi["lat"] = countyLocationData[ind]["lat"];
          countyFromApi["lng"] = countyLocationData[ind]["lng"];
        }
      });
      setCountyData(countyDataFromApi);
    },
  });
}

function buildMiDataV2(setCountyData) {
  let miGovSite =
    "https://cors-anywhere.herokuapp.com/https://www.michigan.gov/coronavirus/0,9753,7-406-98163_98173---,00.html";
  axios.get(miGovSite).then((res) => {
    const $ = cheerio.load(res.data);
    let miStat = {};
    let countyDataFromApi = [];
    countyDataFromApi = $(
      ".fullContent > table > tbody > tr > td"
    ).map((element) => {});
    countyDataFromApi.forEach((countyFromApi) => {
      let ind = countyLocationData.findIndex(
        (cLocData) =>
          cLocData.county.split(",")[0].trim() === countyFromApi.county
      );
      if (ind > 0) {
        countyFromApi["lat"] = countyLocationData[ind]["lat"];
        countyFromApi["lng"] = countyLocationData[ind]["lng"];
      }
    });
    setCountyData(countyDataFromApi);
  });
}

// function newFunction_1(inputArray) {
//   const countyLocationData = [];
//   batchGeocode("", inputArray).then((data) => {
//     data.forEach((d) => {
//       var jsonData = {};
//       jsonData["county"] = d["input"];
//       jsonData["lat"] = d["geometry"]["lat"];
//       jsonData["lng"] = d["geometry"]["lng"];
//       countyLocationData.push(jsonData);
//     });
//     console.log(countyLocationData);
//   });
// }
