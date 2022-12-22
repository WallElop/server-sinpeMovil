const AWS = require("aws-sdk");

// Create user function
const createUser = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    // Get data from request
    const { number, name } = JSON.parse(event.body);
    const createdAt = new Date().toISOString(); // Current date
    const balance = 0; // Initial balance 

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

// Get user function
const getUser = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const user = await dynamoDb
      .get({
        TableName: "UserTable",
        Key: {
          number: event.pathParameters.number, // Get number from request
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

// Update balance function
const updateBalance = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { balance } = JSON.parse(event.body);

    // Update balance in user table
    const updatedUser = await dynamoDb
      .update({
        TableName: "UserTable",
        Key: {
          number: event.pathParameters.number,
        },
        UpdateExpression: "SET balance = balance - :balance", // Update balance to balance - amount
        ExpressionAttributeValues: {
          ":balance": balance,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ user: updatedUser.Attributes }),
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
