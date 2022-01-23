import {
    APIGatewayProxyEventV2WithRequestContext,
    APIGatewayProxyResult,
} from 'aws-lambda';
import createAdminUseCase from '../useCases/createAdmin';
import CreateAdminValidation from '../utils/validations/CreateAdminValidation';

interface IParsedfromEventBody {
    [name: string]: any;
}

interface IPayloadCreateAdminValidation {
    email: string;

    name: string;

    password: string;
}

export const handler = async (
    event: APIGatewayProxyEventV2WithRequestContext<any>
): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        isBase64Encoded: false,
        statusCode: 201,
        body: '',
        headers: {
            'content-type': 'application/json',
        },
    };

    const parsedBody: IParsedfromEventBody = JSON.parse(event.body);

    try {
        const createAdminValidation = new CreateAdminValidation(parsedBody);

        const createAdminPayloadValidation: IPayloadCreateAdminValidation =
            await createAdminValidation.validateInput();

        await createAdminUseCase.execute(createAdminPayloadValidation);

        response.body = JSON.stringify({
            message: 'Successfully create Admin account',
        });
    } catch (error) {
        if (error.message === '400') {
            response.statusCode = 400;

            response.body = JSON.stringify({
                mainMessage: 'Failed to create Admin account',
                errorMessage: 'Incorrect body',
            });
        } else {
            response.statusCode = 500;

            response.body = JSON.stringify({
                mainMessage: 'Failed to create Admin account',
                errorMessage:
                    'There is an error on our servers, please try again later',
            });
        }
    }

    return response;
};
