import config from "../config.json" with { type: "json" };

const BASE_URL = "https://www.omdbapi.com/";

function getDataFromTitle(title) {
  const url = new URL(BASE_URL);
  url.searchParams.append("apikey", config.omdbapiKey);
  url.searchParams.append("t", title);
  return fetch(url)
    .then(result => result.json())
    .catch(err => { console.warn(err); })
}

export { getDataFromTitle };
