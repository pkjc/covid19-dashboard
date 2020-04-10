import opencage from "opencage-api-client";

/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

const isDomAvailable = () => {
  return (
    typeof window !== "undefined" &&
    !!window.document &&
    !!window.document.createElement
  );
};

const batchGeocode = (key, addresses) => {
  return new Promise((resolve, reject) => {
    let results = [];
    let prs = [];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (address.length > 0) {
        const p = opencage.geocode({ key, q: address }).then((response) => {
          const { geometry, formatted } = response.results[0];
          results.push({ input: address, geometry, formatted });
        });
        prs.push(p);
      }
    }
    Promise.all(prs).then((values) => {
      resolve(results);
    });
  });
};

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const isYesterday = (someDate) => {
  const today = new Date("2020-04-03");
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export { isToday, isYesterday, isDomAvailable, batchGeocode };
