const AWS = require("aws-sdk");
// const middy = require("@middy/core");
// const jsonBodyParser = require("@middy/http-json-body-parser");

const createMovement = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { senderNumber, amount, receiverNumber, detail } = JSON.parse(event.body);
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

    /**
     * TODO: Get the movement from the database using the senderNumber and createdAt
     */
  } catch (error) {
    return {
      statusCode: 400,
      body: {
        message: error.message,
      },
    };
  }
};


module.exports = {
  createMovement,
};
