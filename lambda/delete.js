import { DynamoDBClient, DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

// DynamoDB 클라이언트를 생성합니다.
const dynamodb = new DynamoDBClient();

export const handler = async (event) => {
    // 리턴할 값을 선언합니다.
    let response;

    try {
        //body 값 받아오기
        response = JSON.parse(event.body);
        
              // DynamoDB에 로드할 파라미터를 정의
              const loadParams = {
                TableName: "dynamo_apigateway_query",
                Key: {
                    id : { S: response.text.trim() }, //trim() 공백제거
                },
            };

            const loadCommand = new GetItemCommand(loadParams);
            const retrievedData = await dynamodb.send(loadCommand);

            if (!retrievedData.Item) {
              return {
                  statusCode: 404,
                  headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Access-Control-Allow-Credentials": true,
                  },
                  body: JSON.stringify({ deleteResponse: "db에 없어요" }),
              };
          }


        // DynamoDB에 삭제할 파라미터를 정의
        const params = {
            TableName: "dynamo_apigateway_query",
            Key: {
                id : { S: response.text.trim() }, //trim() 공백제거
            },
        };

        console.log(params)

        const command = new DeleteItemCommand(params);
        const deleteResponse = await dynamodb.send(command);


        // 성공적으로 반환함
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ deleteResponse: "delete complete" })
        };

    } catch (e) {
        // 에러 발생 시 에러 메시지를 반환합니다.
        return {
          statusCode: 500,
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({ error: e })
      };
    }


};
