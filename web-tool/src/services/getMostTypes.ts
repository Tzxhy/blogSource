import axios from 'axios';
import { BASE_RESPONSE } from './base';
import { DOMAIN, urls } from './url';

export type GET_MOST_TYPES_DATA = BASE_RESPONSE<{
    key: string;
    value: number;
}[]>;

export function getMostTypes(types: string[]): Promise<GET_MOST_TYPES_DATA> {

    return axios.post(DOMAIN + urls.GET_MOST_TYPES, types, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(d => d.data);
}
