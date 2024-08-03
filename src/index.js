import url from 'node:url';
import path from 'node:path';
import express from 'express';
import session from 'express-session';

import routes from './routes/index.js';

const PORT = process.env.PORT || 8000;
const app = express();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'ejs');
app.use(
  session({
    secret: '059976e2ef27b4e4',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1 * 60 * 1000 },
  }),
);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
