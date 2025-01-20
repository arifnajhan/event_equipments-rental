'use client';

import { use, useState } from 'react';
import { getUserBookings } from "@/libs/apis";
import { User } from "@/models/user";
import axios from "axios";
import useSWR from "swr";
import Image from 'next/image';
import LoadingSpinner from '../../loading';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { BsJournalBookmarkFill, BsCurrencyDollar } from 'react-icons/bs';
import { signOut } from 'next-auth/react';
import Table from '@/components/Table/Table';
import { Booking } from '@/models/booking';

type NavType = 'bookings' | 'amount' | 'ratings';

const UserDetails = (props: { params: Promise<{ id: string }> }) => {
    const { id: userId } = use(props.params);
    const [currentNav, setCurrentNav] = useState<NavType>('bookings');

    const { data: userBookings, error: bookingsError, isLoading: bookingsLoading } = 
        useSWR<Booking[]>(`/api/bookings/${userId}`, () => getUserBookings(userId));

    const { data: userData, isLoading: userLoading, error: userError } = 
        useSWR<User>("/api/users", async () => {
            const { data } = await axios.get('/api/users');
            return data;
        });

        if (bookingsError || userError) {
            return <div className="container mx-auto p-4">
                <p className="text-red-500">Error loading data. Please try again later.</p>
            </div>;
        }
    
        if (userLoading || bookingsLoading) return <LoadingSpinner />;
        if (!userData) return null;
    
        const navigationItems: Array<{ id: NavType; label: string; icon: JSX.Element }> = [
            { id: 'bookings', label: 'Current Bookings', icon: <BsJournalBookmarkFill /> },
            { id: 'amount', label: 'Amount Spent', icon: <BsCurrencyDollar /> }
        ];
    
        const calculateTotalAmount = (bookings: Booking[]): string => {
            return bookings.reduce((total: number, booking: Booking) => 
                total + booking.totalPrice, 0
            ).toFixed(2);
        };

    return (
        <div className='container mx-auto px-2 md:px-4 py-10'>
            <div className='grid md:grid-cols-12 gap-10'>
                {/* Sidebar */}
                <aside className='hidden md:block md:col-span-4 lg:col-span-3 shadow-lg h-fit sticky top-10 bg-[#eff0f2] text-black rounded-lg px-6 py-4'>
                    <div className='md:w-[143px] w-28 h-28 md:h-[143px] mx-auto mb-5 relative rounded-full overflow-hidden'>
                        <Image 
                            src={userData.image}
                            alt={userData.name}
                            fill
                            className='img scale-animation object-cover rounded-full'
                        />
                    </div>
                    
                    <div className='space-y-4'>
                        <div>
                            <h6 className='text-xl font-bold pb-2'>{userData.name}</h6>
                            <p className='text-sm text-gray-600'>
                                Joined {new Date(userData._createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        
                        {userData.about && (
                            <div>
                                <h6 className='text-xl font-bold pb-2'>About</h6>
                                <p className='text-sm'>{userData.about}</p>
                            </div>
                        )}

                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors'
                        >
                            <span>Sign Out</span>
                            <FaSignOutAlt className='text-xl' />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className='md:col-span-8 lg:col-span-9'>
                    {/* Mobile Header */}
                    <div className='md:hidden space-y-4 mb-6'>
                        <div className='flex items-center space-x-4'>
                            <div className='w-14 h-14 relative rounded-full overflow-hidden'>
                                <Image
                                    src={userData.image}
                                    alt={userData.name}
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div>
                                <h5 className='text-2xl font-bold'>Hello, {userData.name}</h5>
                                <p className='text-sm text-gray-600'>
                                    Joined {new Date(userData._createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        
                        {userData.about && (
                            <p className='text-sm'>{userData.about}</p>
                        )}

                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center space-x-2 text-gray-700'
                        >
                            <span>Sign Out</span>
                            <FaSignOutAlt className='text-xl' />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className='sticky top-0 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8'>
                        <div className='flex flex-wrap gap-4'>
                            {navigationItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentNav(item.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                                        ${currentNav === item.id 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                    <span className='text-sm font-medium'>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Content */}
                    {currentNav === 'bookings' && userBookings && (
                        <Table bookingDetails={userBookings} userId={userId} />
                    )}
                    
                    {currentNav === 'amount' && userBookings && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Total Amount Spent</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        RM {calculateTotalAmount(userBookings)}
                    </p>
                </div>
            )}
                </main>
            </div>
        </div>
    );
};

export default UserDetails;