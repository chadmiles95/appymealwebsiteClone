import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import { ThemeProvider } from '@/infastructure/ThemeProvider';

describe('Home', () => {
  it('renders a heading', () => {
    const mockProductDate = {
      _id: 123,
      title: 'abc',
      description: 'abc',
      oldPrice: 123,
      price: 123,
      brand: 'abc',
      image: 'abc',
      isNew: true,
      category: 'abc',
    };
    const mockRestaurantData = {
      id: 'abc',
      name: 'abc',
      username: 'abc',
      city: 'abc',
      zip: 'abc',
      state: 'abc',
      desc: 'abc',
      email: 'abc',
      phoneNumber: 'abc',
      address: 'abc',
      hours: '9-5',
      lat: 123,
      lng: 123,
      accountType: 'abc',
      menus: 'foo',
      isOpen: true,
      isShowing: true,
      createdAt: 'abc',
      photo: 'abc',
      location: {},
      viewport: {},
      fanDiscount: 123,
      fanCount: 123,
      images: [],
      fans: [],
      enableFans: true,
      enableDelivery: true,
      enablePrinting: true,
      deliveryType: {},
      expectedWaitTime: 123,
      menuSelected: 'abc',
      menuHours: 'abc',
      menuStatus: 'foo'
    };
    render(
      <ThemeProvider>
        <Home productData={mockProductDate} restaurantData={mockRestaurantData} />
      </ThemeProvider>
    );

    // Placeholder test
    expect(true).toBe(true)
  })
})
