import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

// 서울 리전으로 Translate 클라이언트를 생성합니다.
const translate = new TranslateClient({ region: 'ap-northeast-2' });

export const handler = async (event) => {
    // 이벤트의 바디를 로그에 기록합니다.
    console.log(JSON.stringify(event.body));

    // 이벤트 바디를 JSON으로 파싱합니다.
    let response;
    try {
        response = JSON.parse(event.body);

        // 번역 파라미터를 정의합니다.
        const translateParams = {
            SourceLanguageCode: 'ko',
            TargetLanguageCode: 'en',
            Text: response.text
        };

        // TranslateTextCommand를 사용하여 번역을 요청합니다.
        const command = new TranslateTextCommand(translateParams);
        const data = await translate.send(command);

        // 성공적으로 번역된 텍스트를 반환합니다.
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // S3에서 요청을 허용합니다.
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data.TranslatedText)
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
