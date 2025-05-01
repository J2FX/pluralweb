const express = require("express");
const cors = require("cors");
require("dotenv").config();
const audioRoutes = require("./routes/audio");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/audios", audioRoutes);

app.listen(process.env.PORT, () =>
  console.log(`API rodando na porta ${process.env.PORT}`)
);
