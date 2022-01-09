import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";
import { document } from "../utils/dynamodbClient";

interface ICreateToDo {
    title: string;
    deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateToDo;
    const newId = uuidV4();
    const deadlineDate = new Date(deadline).toISOString();

    const respose = await document.put({
        TableName: "todos",
        Item: {
            id: newId,
            title,
            user_id: userId,
            done: false,
            deadline: deadlineDate
        }
    }).promise();

    if (!respose.$response.error) {
        return {
            statusCode: 201,
            body: JSON.stringify({ 
                id: newId,
                user_id: userId,
                title,
                done: false,
                deadline: deadlineDate
            }),
            headers: {
                "Content-type": "application/json"
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ 
            message: "Could not create ToDo item, try again later."
        }),
        headers: {
            "Content-type": "application/json"
        }
    }
}