import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const TABLE = process.env.TABLE_NAME;

export const createUser = async (email, hashedPassword) => {
  await dynamo.put({
    TableName: TABLE,
    Item: { email, password: hashedPassword }
  }).promise();
};

export const findUser = async (email) => {
  const res = await dynamo.get({
    TableName: TABLE,
    Key: { email }
  }).promise();
  return res.Item;
};
