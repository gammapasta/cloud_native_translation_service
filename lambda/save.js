import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// DynamoDB 클라이언트를 생성
const dynamodb = new DynamoDBClient();

export const handler = async (event) => {
    // 리턴할 값을 선언
    let response;
    let currentTime = new Date().getTime().toString();

try {
    //body 값 받아오기
    response = JSON.parse(event.body);

    // DynamoDB에 저장할 파라미터를 정의
    const params = {
          TableName: "dynamo_apigateway_query",
          Item: {
            id: { S: currentTime }, //id: { S: randomID },
            data: { S: response.text }   //translate에서 사용한 response에서 body값 가져오는 코드
          }
      };

        // PutItemCommand를 사용하여 DynamoDB에 데이터를 저장
        const command = new PutItemCommand(params);
        await dynamodb.send(command);


    // 성공적으로 반환함
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // S3에서 요청을 허용합니다.
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({translateID: currentTime})
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
