import { db } from '@/pages/_app';
import axios from 'axios';
import { Firestore, collection, query as fbQuery, getDocs, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

let googleDynamicSessionToken = uuidv4();

interface IPlacesAutoCompleteArgs {
  longitude: number;
  latitude: number;
  radius?: number | string;
  types?: string;
  input: string;
  sessiontoken?: string;
}

interface ISearchRestaurantsByLocation {
  latitude: number;
  longitude: number;
  radius?: number;
}

interface IPlaceDetailsArgs {
  placeId: string;
  sessiontoken?: string;
  fieldsGroup?: 'basic' | 'contact' | 'atmosphere';
  shouldIncludeWebsite?: boolean;
  shouldIncludeIntlPhone?: boolean;
  shouldIncludeOpeningHours?: boolean;
  shouldIncludeRating?: boolean;
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

const getPlaceDetails = ({
  placeId,
  sessiontoken,
  fieldsGroup,
  shouldIncludeWebsite,
  shouldIncludeIntlPhone,
  shouldIncludeOpeningHours,
  shouldIncludeRating,
}: IPlaceDetailsArgs) => {
  let groupFields = 'geometry';
  switch (fieldsGroup) {
    case 'basic':
      // eslint-disable-next-line max-len
      groupFields = 'address_components,adr_address,business_status,formatted_address,geometry,icon,icon_mask_base_uri,icon_background_color,name,photo,place_id,plus_code,type,url,utc_offset,vicinity,wheelchair_accessible_entrance';
      break;
    case 'contact':
      // eslint-disable-next-line max-len
      groupFields = 'current_opening_hours,formatted_phone_number,international_phone_number,opening_hours,secondary_opening_hours,website';
      break;
    case 'atmosphere':
      // eslint-disable-next-line max-len
      groupFields = 'curbside_pickup,delivery,dine_in,editorial_summary,price_level,rating,reservable,reviews,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,serves_wine,takeout,user_ratings_total';
      break;
    default:
      groupFields = 'geometry';
  }
  let url = `${process.env.NEXT_PUBLIC_API_HOST}v1/location-service/place/details/json?place_id=${placeId}&`;

  if (shouldIncludeWebsite) {
    groupFields = `${groupFields},website`;
  }
  if (shouldIncludeIntlPhone) {
    groupFields = `${groupFields},international_phone_number`;
  }
  if (shouldIncludeOpeningHours) {
    groupFields = `${groupFields},opening_hours`;
  }
  if (shouldIncludeRating) {
    groupFields = `${groupFields},rating,user_ratings_total`;
  }

  url = `${url}sessiontoken=${sessiontoken || googleDynamicSessionToken}&fields=${groupFields || 'geometry'}`;

  return axios({
    method: 'get',
    url,
    headers: {},
  }).finally(() => {
    googleDynamicSessionToken = uuidv4(); // This must be updated after each call to get place details
  });
};

const searchRestaurantsByLocation = ({
  latitude,
  longitude,
  radius,
}: ISearchRestaurantsByLocation) => {
  const params: any = {
    latitude,
    longitude,
    filterBy: 'delivery-range',
    // radiusMeters: radius || 50 * 1000,
  };
  const query = new URLSearchParams(params);
  return axios({
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_API_HOST}v1/restaurants/search-by-location?${query.toString()}`,
  }).then((response) => {
    const pgRestaurantsMap = response.data?.results?.reduce((acc: any, cur: any) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    const restaurantIds = response.data?.results?.map((r: any) => r.id);

    if (!restaurantIds?.length) {
      return [];
    }

    // TODO: Remove this backwards compatibility hack
    const restaurantsQuery = fbQuery(collection(db, 'restaurants'), where('id', 'in', restaurantIds));
    return getDocs(restaurantsQuery).then((restaurantSnapshot) => {
      const restaurants: any[] = [];

      restaurantSnapshot.forEach((r) => {
        const rData = r.data();
        restaurants.push({
          ...pgRestaurantsMap[rData.id],
          id: rData.id,
          name: rData.name,
          menus: rData.menus,
          hours: rData.hours,
          enable_open: rData.isOpen,
          isOpen: rData.isOpen,
          enable_showing: rData.isShowing,
          isShowing: rData.isShowing,
          images: rData.images,
          photo: rData.photo,
          enableFans: rData.enableFans,
          enable_delivery: rData.enableDelivery,
          enableDelivery: rData.enableDelivery,
          enablePrinting: rData.enablePrinting,
          expectedWaitTime: rData.expectedWaitTime,
        });
      });

      return restaurants;
    });
  });
};

export {
  getPlacesSearchAutoComplete,
  getPlaceDetails,
  searchRestaurantsByLocation,
};
