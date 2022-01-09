import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;

    const response = await document.scan({
        TableName: 'todos',
        FilterExpression: "user_id = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    }).promise();

    const todos = response.Items;

    if (todos.length) {
        return {
            statusCode: 201,
            body: JSON.stringify({ 
                todos
            }),
            headers: {
                "Content-type": "application/json"
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ 
            message: "No ToDo item created for this user yet!"
        }),
        headers: {
            "Content-type": "application/json"
        }
    }
}