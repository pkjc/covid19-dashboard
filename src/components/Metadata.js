import React from "react";
import Helmet from "react-helmet";

const Metadata = () => {
  return (
    <Helmet>
      <title>Covid-19 Tracker for MH and MI</title>
      <meta name="title" content="Covid-19 Tracker for MH and MI" />
      <meta
        name="description"
        content="Get latest counts of confirmed cases and news updates for Michigan and Maharashtra."
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://covid-board.now.sh/" />
      <meta property="og:title" content="Covid-19 Tracker for MH and MI" />
      <meta
        property="og:description"
        content="Get latest counts of confirmed cases and news updates for Michigan and Maharashtra."
      />
      <meta property="og:image" content="../assets/images/sars-cov-19.jpg" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://covid-board.now.sh/" />
      <meta property="twitter:title" content="Covid-19 Tracker for MH and MI" />
      <meta
        property="twitter:description"
        content="Get latest counts of confirmed cases and news updates for Michigan and Maharashtra."
      />
      <meta
        property="twitter:image"
        content="../assets/images/sars-cov-19.jpg"
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="../assets/images/favicons/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="../assets/images/favicons/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="../assets/images/favicons/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="../assets/images/favicons/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="../assets/images/favicons/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="../assets/images/favicons/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="../assets/images/favicons/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="../assets/images/favicons/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="../assets/images/favicons/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="../assets/images/favicons/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="../assets/images/favicons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="../assets/images/favicons/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="../assets/images/favicons/favicon-16x16.png"
      />
      <link rel="manifest" href="../assets/images/favicons/manifest.json" />
    </Helmet>
  );
};

export default Metadata;
