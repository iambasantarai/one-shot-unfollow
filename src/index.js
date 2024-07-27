import express from 'express';

import routes from './routes/index.js';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
