import { getDataFromTitle } from "./omdb.js";


export async function sendDetails(req, res) {
  const movieTitle = req.query.title;

  if (movieTitle == null) {
    res.sendStatus(400);
    return;
  }

  let data = await getDataFromTitle(movieTitle);
  data.playUrl = 
  
  res.send(await getDataFromTitle(movieTitle));
}
