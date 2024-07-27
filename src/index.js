import url from 'node:url';
import path from 'node:path';
import express from 'express';

import routes from './routes/index.js';

const PORT = process.env.PORT || 8000;
const app = express();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'ejs');
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
