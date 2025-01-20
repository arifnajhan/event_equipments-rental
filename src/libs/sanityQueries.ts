import { groq } from "next-sanity";


export const getFeaturedEquipmentsQuery = groq`*[_type == "eventEquipments" && isFeatured == true] [0] {

    _id,
    coverImage,
    description,
    isBooked,
    isFeatured,
    name,
    price,
    slug,
    type,
    specialNote,
    images
}`;

export const getEquipmentsQuery = groq`*[_type == "eventEquipments"]{
    
    _id,
    coverImage,
    description,
    isBooked,
    isFeatured,
    name,
    price,
    slug,
    type,
}`;

export const getEquipment = groq`*[_type == "eventEquipments" && slug.current == $slug][0] {
    _id,
    coverImage,
    description,
    discount,
    images,
    isBooked,
    isFeatured,
    name,
    price,
    slug,
    specialNote,
    type
}`;

export const createPaymentQuery = groq`
  *[_type == "payment" && _id == $paymentId][0]
`;

export const getPaymentsByUserQuery = groq`
  *[_type == "payment" && user._ref == $userId] | order(transactionDate desc) {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionDate,
    paymentDetails,
    booking->{
      rentDate,
      returnDate,
      eventEquipments->{
        name,
        slug
      }
    }
  }
`;

export const getPaymentsByBookingQuery = groq`
  *[_type == "payment" && booking._ref == $bookingId][0] {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionDate,
    paymentDetails
  }`;

  export const getBookingQuery = `*[_type == "booking" && _id == $bookingId][0]{
    _id,
    rentDate,
    returnDate,
    numberOfDays,
    totalPrice,
    eventEquipments->{
      _id,
      name,
      price,
      slug {
        current
      }
    }
  }`;
  
  export const getUserBookingsQuery = groq`*[_type == 'booking' && user._ref == $userId]{
    _id,
    rentDate,
    returnDate,
    numberOfDays,
    totalPrice,
    status,  // Add this line
    eventEquipments->{
        _id,
        name,
        price,
        slug {
            current
        }
    }
}`;

  export const getUserDataQuery = groq`*[_type == 'user' && _id == $userId] [0] {
    _id,
    name,
    email,
    isAdmin,
    about,
    _createdAt,
    image,
    }`;

    export const getPaymentQuery = `
  *[_type == "payment" && _id == $paymentId][0] {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionDate,
    paymentDetails,
    user->{
      _id,
      name,
      email
    },
    booking->{
      _id,
      rentDate,
      returnDate,
      totalPrice,
      status
    }
  }
`;

export const getUserPaymentsQuery = `
  *[_type == "payment" && user._ref == $userId] {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionDate,
    booking->{
      _id,
      rentDate,
      returnDate,
      totalPrice,
      status,
      eventEquipments->{
        name,
        slug
      }
    }
  }
`;

export const getBookingPaymentQuery = `
  *[_type == "payment" && booking._ref == $bookingId][0] {
    _id,
    amount,
    paymentMethod,
    paymentStatus,
    transactionDate
  }
`;

export const addToMyBookingsQuery = groq`
  *[_type == "booking" && _id == $bookingId][0] {
    _id,
    rentDate,
    returnDate,
    numberOfDays,
    totalPrice,
    status,
    eventEquipments->{
      _id,
      name,
      price,
      slug {
        current
      }
    }
  }
`;