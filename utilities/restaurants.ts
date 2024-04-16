import { isMenuHours } from '@/components/RestaurantCard';
import { Restaurant } from 'type';

const reformatRestaurant = (restaurant: Partial<Restaurant>, currentDayUTC: number, currentMilitaryTimeUTC: number) => {
    // Add your logic to manipulate the single restaurant object here
    const menus = restaurant.hours[currentDayUTC]?.menus;
    let data: Partial<Restaurant> = {
      ...restaurant,
      menuStatus: false,
    };

    if (menus) {
      const menuEntries = Object.entries(menus);
      const menuLength = menuEntries.length;

      menuEntries.forEach(([key, value], i) => {
        if (isMenuHours(currentMilitaryTimeUTC.toString(), value as string)) {
          data = {
            ...data,
            hours: restaurant.hours[currentDayUTC]?.time,
            menus: restaurant.menus[key],
            menuSelected: key,
            menuStatus: true,
            menuHours: value as any,
          };
        } else if (
          i === menuLength - 1 &&
          data.menuStatus !== true &&
          typeof data.hours[currentDayUTC].menus !== "undefined"
        ) {
          data = {
            ...data,
            hours: data.hours[currentDayUTC]?.time,
            menus: data.menus[key],
            menuSelected: key,
            menuStatus: true,
            menuHours: value as any,
          };
        }
      });
    }

    return data;
}

export {
    reformatRestaurant,
};
