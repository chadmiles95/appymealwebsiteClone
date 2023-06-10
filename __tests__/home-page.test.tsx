import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import { ThemeProvider } from '@/infastructure/ThemeProvider';
import { orderOnlyText } from '@/components/LandingPage';

describe('Home', () => {
  it('renders a heading and buttons', async () => {
    const mockProductData = {
      item: 'Hamburger',
      id: 'Hamburger-123',
      price: 9.99,
      modifiers: ['quarter pounder', null, null],
      quantity: 3
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
        <Home productData={mockProductData} restaurantData={mockRestaurantData} />
      </ThemeProvider>
    );

    const orderElements = screen.getAllByText(RegExp(orderOnlyText, 'i'));
    expect(orderElements.length).toBe(2);

    const orderButton = orderElements[1];
    // Note: To test further routing, we would need to render the entire app in the test.
    // Instead, I think it's better to test each page in a separate test
  });
});
