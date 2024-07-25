import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const API_URL = 'https://api.themoviedb.org/3/';
const yourAPIKey = 'd53ac21363d1167fb3452b80681e449a';
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.render("index.ejs", { movies: [] });
});



app.get('/fetch-movies', async (req, res) => {
const query = req.query.query; // Get the query from the URL parameters
if (!query) {
  return res.status(400).send('Query is required');
}
  try{
    const response = await axios.get(`${API_URL}search/movie`, {
      params: {
        api_key: yourAPIKey,
        query: query,       
      }      
    });
    const movies = response.data.results.map(movie => ({
      title: movie.original_title,
      overview: movie.overview,
      releaseDate: movie.release_date,
    }));
    res.render("index.ejs", { movies });
  }
  catch(error) {
    res.status(404).send(error.message);
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

