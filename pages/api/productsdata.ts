// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  _id: number;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  brand: string;
  image: string;
  isNew: boolean;
  category: string;
}[];

const productData = [
  {
    _id: 101,
    title: "Canon EOS Rebel T100",
    description:
      "Canon EOS Rebel T100 Digital SLR Camera with 18-55mm Lens Kit, 18 Megapixel senser and more",
    oldPrice: 700.0,
    price: 559.99,
    brand: "Canon",
    image: "https://i.ibb.co/1r28gMk/1.webp",
    isNew: true,
    category: "Electronics",
  },
  {
    _id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    oldPrice: 200.0,
    price: 109.95,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    isNew: true,
    brand: "True North",
  },
  {
    _id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts ",
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    oldPrice: 40.0,
    price: 22.3,
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    isNew: true,
    brand: "Buckle",
  },
  {
    _id: 3,
    title: "Mens Cotton Jacket",
    description:
      "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    oldPrice: 60.0,
    price: 55.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    isNew: true,
    brand: "Buckle",
  },
  {
    _id: 4,
    title: "Mens Casual Slim Fit",
    description:
      "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    oldPrice: 60.0,
    price: 15.99,
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    isNew: true,
    brand: "Buckle",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(productData);
}
