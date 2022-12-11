const AWS = require("aws-sdk");
// const middy = require("@middy/core");
// const jsonBodyParser = require("@middy/http-json-body-parser");

const createUser = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { number, name } = JSON.parse(event.body);
    const createdAt = new Date().toISOString();
    const balance = 0;

    const newUser = {
      number,
      name,
      balance,
      createdAt,
    };

    await dynamoDb
      .put({
        TableName: "UserTable",
        Item: newUser,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
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

const getUser = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const user = await dynamoDb
      .get({
        TableName: "UserTable",
        Key: {
          number: event.pathParameters.number,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(user.Item),
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

const updateBalance = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { balance } = JSON.parse(event.body);

    await dynamoDb.update({
      TableName: "UserTable",
      Key: {
        number: event.pathParameters.number,
      },
      UpdateExpression: "SET balance = :balance",
      ExpressionAttributeValues: {
        ":balance": balance,
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ "message": "Balance updated" }),
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

module.exports = {
  createUser,
  getUser,
  updateBalance,
};
