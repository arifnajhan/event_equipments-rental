type CoverImage = {
    url: string;
  };
  
  export type Image = {
    _key: string;
    url: string;
  };
  
  type Slug = {
    _type: string;
    current: string;
  };
  
  export type Equipment = {
    _id: string;
    coverImage: CoverImage;
    description: string;
    images: Image[];
    isBooked: boolean;
    isFeatured: boolean;
    name: string;
    price: number;
    slug: Slug;
    specialNote: string;
    type: string;
  };
  
  export type CreateBookingDto = {
    user: string;
    eventEquipments: string;
    rentDate: string;
    returnDate: string;
    numberOfDays: number;
    totalPrice: number;
  };