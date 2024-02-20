import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const googleDynamicSessionToken = uuidv4();

interface IPlacesAutoCompleteArgs {
  longitude: number;
  latitude: number;
  radius?: number | string;
  types?: string;
  input: string;
  sessiontoken?: string;
}

// Google Maps
const getPlacesSearchAutoComplete = ({
  longitude,
  latitude,
  radius,
  types,
  input,
  sessiontoken,
}: IPlacesAutoCompleteArgs) => {
  let url = `${process.env.NEXT_PUBLIC_API_HOST}v1/location-service/place/autocomplete/json?`;

  url = `${url}input=${input}&location=${latitude},${longitude}&locationbias=circle:radius@lat,lng`;

  if (radius) {
      url = `${url}&radius=${radius}`;
  }

  if (types) {
      url = `${url}&types=${types}`;
  }

  url = `${url}&sessiontoken=${sessiontoken || googleDynamicSessionToken}`;

  return axios({
      method: 'get',
      url,
      headers: {},
  });
};

export {
    getPlacesSearchAutoComplete,
};
