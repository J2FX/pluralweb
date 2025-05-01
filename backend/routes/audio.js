const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Simulação simples de banco
const audios = [];

router.post("/generate", async (req, res) => {
  const { site_id, page_id, texto_simples } = req.body;
  const buffer = Buffer.from("Fake audio binary"); // simule um arquivo real aqui

  const key = `${site_id}-${page_id}.mp3`;

  try {
    const s3res = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `audios/${key}`,
        Body: buffer,
        ContentType: "audio/mpeg",
        ACL: "public-read",
      })
      .promise();

    const audioData = {
      site_id,
      page_id,
      audio_url: s3res.Location,
      data: new Date(),
    };
    audios.push(audioData);
    res.json(audioData);
  } catch (err) {
    res.status(500).json({ error: "Erro no upload para o S3" });
  }
});

router.get("/:site_id/:page_id", (req, res) => {
  const { site_id, page_id } = req.params;
  const result = audios.find(
    (a) => a.site_id === site_id && a.page_id === page_id
  );
  if (!result) return res.status(404).json({ error: "Não encontrado" });
  res.json(result);
});

module.exports = router;
