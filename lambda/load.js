import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

// DynamoDB 클라이언트를 생성합니다.
const dynamodb = new DynamoDBClient();

export const handler = async (event) => {
    // 리턴할 값을 선언합니다.
    let response;

    try {
        //body 값 받아오기
        response = JSON.parse(event.body);
        console.log(response)
        
        // DynamoDB에 로드할 파라미터를 정의합니다.
        const params = {
            TableName: "dynamo_apigateway_query",
            Key: {
                id : { S: response.text.trim() }, //trim() 공백제거
            },
            //ProjectionExpression: "data",
        };

        console.log(params)

        const command = new GetItemCommand(params);
        const retrievedData = await dynamodb.send(command);

                // 조회된 데이터가 없을 경우
                if (!retrievedData.Item) {
                    return {
                        statusCode: 404,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Credentials": true,
                        },
                        body: JSON.stringify({ error: "Item not found" }),
                    };
                }

        // 성공적으로 반환함
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({ dbValue: retrievedData.Item.string.S })  //db에서 받아온 값을 클라이언트로 반환
        };

    } catch (e) {
        // 에러 발생 시 에러 메시지를 반환합니다.
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // S3에서 요청을 허용합니다.
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(e)
        };
    }


};
