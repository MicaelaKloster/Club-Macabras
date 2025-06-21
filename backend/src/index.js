import express from 'express';
import cors from 'cors';
import './config/db.js'; // ya se conecta automáticamente

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Club Macabras - API funcionando ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
