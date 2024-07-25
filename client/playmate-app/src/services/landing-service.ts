import * as baseService from './base-service';

const landingPath = '/events/upcomingEvents';

export const upcomingEvents = async(sport: string, city: string): Promise<any> => {
    const requestURL = `${landingPath}/${sport}/${city}`;
    const upEvents = await baseService.get<any>(requestURL);
    return upEvents;
}