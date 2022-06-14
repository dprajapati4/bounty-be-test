import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morgan('dev'));

app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});


app.get('/api', (req: Request, res: Response) => {
  res.send('on api route');
});

const fetchData = async (query: any) => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`)
  if (data) {
    return data
  }
};

const removeDuplicates = (query: any) => {
  const queryArr: Array<string> = query.split(',')
  console.log('remove', queryArr)
  const uniqueQueries: any = [];
  queryArr.forEach((query: any) => {
    if (!uniqueQueries.includes(query)) {
      uniqueQueries.push(query);
    }
    console.log('sfter', uniqueQueries)
  });
  return uniqueQueries
}

//https://pokeapi.co/api/v2/pokemon/{id or name}/
app.get('/pokemon-details', async (req: Request, res: Response, next: NextFunction) => {
  const pokemon = req.query.pokemon
  console.log('pokemon', removeDuplicates(pokemon))
  try {
    const data = await fetchData(pokemon)
    res.send(data)
  } catch (error) {
    console.log('Error fetching pokemon data', error)
  }

});

// Error handling endware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Endware erroree', err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
