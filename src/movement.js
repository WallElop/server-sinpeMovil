const AWS = require("aws-sdk");
// const middy = require("@middy/core");
// const jsonBodyParser = require("@middy/http-json-body-parser");

const createMovement = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { senderNumber, amount, receiverNumber, detail } = JSON.parse(
      event.body
    );
    const createdAt = new Date().toISOString();

    const newMovement = {
      senderNumber,
      createdAt,
      amount,
      receiverNumber,
      detail,
    };

    await dynamoDb
      .put({
        TableName: "MovementTable",
        Item: newMovement,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newMovement),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: {
        message: error.message,
      },
    };
  }
};

const getMovement = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const { createdAt } = JSON.parse(event.body);
    const senderNumber = event.pathParameters.number;

    const params = {
      TableName: "MovementTable",
      ExpressionAttributeValues: {
        ":senderNumber": senderNumber,
        ":createdAt": createdAt,
      },
      KeyConditionExpression:
        "senderNumber = :senderNumber AND createdAt = :createdAt",
    };

    const result = await dynamoDb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: {
        message: error.message,
      },
    };
  }
};

const getMovements = async (event) => {
  // try {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const { number } = event.pathParameters;
  const { createdAt } = JSON.parse(event.body);

  const params = {
    TableName: "MovementTable",
    ExpressionAttributeValues: {
      ":senderNumber": number,
    },
    FilterExpression:
      "senderNumber = :senderNumber OR receiverNumber = :senderNumber",
    Limit: 10,
    ExclusiveStartKey: createdAt
      ? {
          senderNumber: number,
          createdAt: createdAt,
        }
      : null,
  };

  const movements = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(movements),
  };
  // } catch (error) {
  //   return {
  //     statusCode: 404,
  //     body: {
  //       message: error.message,
  //     },
  //   };
  // }
};

module.exports = {
  createMovement,
  getMovement,
  getMovements,
};
