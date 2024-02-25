import React, { useCallback, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setIsRestaurantsSearchResultsVisible, setRestaurantsFiltered, setRestaurantsSearch, setRestaurantsSearchResults } from "../redux/shoppersSlice";
import { getPlaceDetails, getPlacesSearchAutoComplete, searchRestaurantsByLocation } from "../services/location";

export const searchBarPlaceHolderText = 'Enter a city to search';
export const RESTAURANT_INPUT_ID = 'restaurant-search-input';

const debounce = (func: Function, timeout = 300) => {
  let timeoutId: NodeJS.Timeout | undefined;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const SearchBar = () => {
  const dispatch = useDispatch();
  const restaurantSearch = useSelector((state: any) => state.shopper.restaurantsSearch);
  const searchResults = useSelector((state: any) => state.shopper.restaurantsSearchResults);
  const isRestaurantsSearchResultsVisible = useSelector((state: any) => state.shopper.isRestaurantsSearchResultsVisible);

  const getPredictions = (query: string) => {
    dispatch(setRestaurantsFiltered([]));

    if (!query?.length) {
      dispatch(setIsRestaurantsSearchResultsVisible(false));
      dispatch(setRestaurantsSearchResults([]));
      return;
    }
  
    getPlacesSearchAutoComplete({
      input: query,
      latitude: 33.7673401, // TODO: Default to Atlanta or user's location
      longitude: -84.5025305, // TODO: Default to Atlanta or user's location
    }).then((response) => {
      dispatch(setIsRestaurantsSearchResultsVisible(true));
      dispatch(setRestaurantsSearchResults(response.data?.predictions || []));
    }).catch((err) => {
      console.log('Google API location predictions error:', err);
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLocations = useCallback(debounce(getPredictions, 300), [setRestaurantsSearchResults, setIsRestaurantsSearchResultsVisible]);

  const onSearchChange = (event: any) => {
    const { value } = event.currentTarget;
    const search: any = {
      input: value,
    };
    if (!value) {
      search.selectedId = ''; // clears the input to reset result set
    }
    dispatch(setRestaurantsSearch(search));
    searchLocations(value);
  };

  const onClickInput = (event: any) => {
    const { value } = event.currentTarget;
    if (value?.length) {
      dispatch(setRestaurantsSearch({
        input: value,
      }));
      getPredictions(value);
    }
  }

  const onSelectResult = (event: any) => {
    event.preventDefault();
    const result = searchResults?.find((r: any) => r?.place_id === event.currentTarget?.id)
    if (result) {
      dispatch(setRestaurantsSearch({
        input: result.description,
        selectedId: result.place_id,
        isLoading: true,
      }));

      getPlaceDetails({
        placeId: result.place_id,
      }).then((placeResponse) => {
        const {
          lat,
          lng,
        } = placeResponse?.data?.result?.geometry?.location;

        return searchRestaurantsByLocation({
          latitude: lat,
          longitude: lng,
        }).then((response) => {
          const nearbyRestaurants = response.data;
          dispatch(setRestaurantsFiltered(nearbyRestaurants))
        })
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        dispatch(setRestaurantsSearch({
          isLoading: false,
        }));
      });
    }
  }

  return (
    <div className="h-12 w-full flex flex-1 relative">
      <input
        id={RESTAURANT_INPUT_ID}
        className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
        type="text"
        onChange={onSearchChange}
        placeholder={searchBarPlaceHolderText}
        value={restaurantSearch?.input || ''}
        onClick={onClickInput}
      />
      <span className="absolute w-12 h-12 rounded-full flex items-center justify-center top-50 right-0 bg-dark text-smoke text-xl">
        <IoSearchOutline />
      </span>
      
      {
        isRestaurantsSearchResultsVisible &&
        <ul className="search-results text-dark text-base border-[1px] shadow-md">
          {
            searchResults?.map((prediction: any) => (
              <li key={prediction.place_id} className="search-result-item">
                <button id={prediction.place_id} className="w-full" onClick={onSelectResult} onSelect={onSelectResult}>{prediction.description}</button>
              </li>
            ))
          }
          {
            searchResults?.length < 1 &&
            <li className="search-result-item no-results">No results found...</li>
          }
        </ul>
      }
    </div>
  );
};

export default SearchBar;
