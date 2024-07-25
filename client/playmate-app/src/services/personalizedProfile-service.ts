import * as baseService from './base-service';

const profilePath = '/personalizedProfile/profile';
const myProfilePath = '/personalizedProfile/profile/:id';

export const createProfile = async (data:any): Promise<any> => {
    const profile = await baseService.post<any>(profilePath, data);
    return profile;
}

export const getProfileById = async (id: string): Promise<any> => {
    const path = myProfilePath.replace(':id', id);
    const profile = await baseService.get<any>(myProfilePath);
    return profile;
  }