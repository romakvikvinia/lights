import { jsonRequest } from '../helpers/api.request.helper';
import { baseUrl } from '../helpers/baseUrl';

export const fetchDevices = () => jsonRequest(`${baseUrl}/v1/device`);
