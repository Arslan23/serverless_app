import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient()
const toDosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX


export async function getAllToDoByUserId(userId: string): Promise<TodoItem[]> {
  const params = {
    TableName: toDosTable,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
        "#userId": "userId"
    },
    ExpressionAttributeValues: {
        ":userId": userId
    }
};

    const result = await this.docClient.query(params).promise();
    const items = result.Items;
    return items as TodoItem[];
}



export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  console.log('Getting  to do by id')

  const params = {
    TableName: toDosTable,
    Key: {
        userId: todo.userId,
        todoId: todo.todoId

    },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
        ":attachmentUrl": todo.attachmentUrl 
    }
};

    const result = await this.docClient.update(params).promise();
    return result.Attributes as TodoItem;
}


export async function getTodoById(todoId: string): Promise<TodoItem> {
  console.log('Getting  to do by id')

  const params = {
    TableName: toDosTable,
    indexName: index,
    KeyConditionExpression: "#todoId = :todoId",
    ExpressionAttributeValues: {
        ":userId": todoId
    }
};

    const result = await this.docClient.query(params).promise();
    const items = result.Items;
    if(items.length !== 0)
    {
       result.Items[0] as TodoItem;
    }
    return null;
}

// TODO: Implement the dataLayer logic
export async function createToDo(toDo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: toDosTable,
      Item: toDo
    }).promise()

    return toDo
  }




  export async function deleteToDo(todoId: string, userId: string): Promise<string> {
    const params = {
        TableName: toDosTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
    };

    const result = await this.docClient.delete(params).promise();
    return "" as string;
}







  // export async function updatedTodo(todoUpdate: TodoUpdate, todoId: string, userId: string)
  // {

  // }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    return new XAWS.DynamoDB.DocumentClient()
}