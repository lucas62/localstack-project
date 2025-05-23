const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3({
  endpoint: "http://host.docker.internal:4566",
  s3ForcePathStyle: true,
});

exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    try {
      const input = await s3.getObject({ Bucket: bucket, Key: key }).promise();

      const resized = await sharp(input.Body)
        .resize(300, 300)
        .toBuffer();

      await s3.putObject({
        Bucket: "send-file-bucket-output",
        Key: `resized-${key}`,
        Body: resized,
        ContentType: "image/jpeg",
      }).promise();

      console.log(`Imagem processada com sucesso: resized-${key}`);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
    }
  }
};
