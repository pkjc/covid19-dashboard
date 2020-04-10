import React from "react";
import Helmet from "react-helmet";
import Layout from "components/Layout";
import Container from "components/Container";
// import { batchGeocode } from "lib/util";
// import Papa from "papaparse";
// import { isToday, isYesterday } from "../lib/util";
// import countyLocationData from "../data/county-latlong";

// function newFunction_1(inputArray) {
//   const countyLocationData = [];
//   batchGeocode("132ba4ca07734bb798f5f53eb69d9f7c", inputArray).then((data) => {
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

const SecondPage = () => {
  // const STATE_COUNTIES_API =
  //   "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

  // newFunction(STATE_COUNTIES_API);
  // console.log(countyLocationData);
  return (
    <Layout pageName="two">
      <Helmet>
        <title>Page Two</title>
      </Helmet>
      <Container type="content" className="text-center">
        <h1>About</h1>
        <h2>Track Covid 19 cases in Maharashtra and Michigan.</h2>
      </Container>
    </Layout>
  );
};

export default SecondPage;
