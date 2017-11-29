import http from 'http';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

const app = express();
app.server = http.createServer(app);

app.use(session({
  secret: 's ndfkjvn nsdfjivn',
  saveUninitialized: true,
  cookie: { }
}));

app.use(morgan('dev'));

app.use(cors({
  exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
  limit : config.bodyLimit
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

initializeDb(state => {
  app.use(middleware({ config, state }));
  app.use('/api', api({ config, state }));

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
