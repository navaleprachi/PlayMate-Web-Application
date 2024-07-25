import * as baseService from './base-service';

const eventHistoryPath = "/events/eventHistory";

export const eventHistory = async (userId: any ): Promise<any> => {
    const requestURL = `${eventHistoryPath}/${userId}`;
    const eventHistory = await baseService.get<any>(requestURL);
    return eventHistory;
}