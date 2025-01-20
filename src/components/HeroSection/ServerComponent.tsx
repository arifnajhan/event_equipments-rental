import Image from 'next/image';

export const heading1 = (
  <>
    <h1 className='font-heading mb-6'>Explore Our Premium Event Rentals</h1>
    <p className='text-[#4a4a4a] dark:text-[#ffffffea] mb-12 max-w-lg'>
    Experience a seamless rental process with a wide range of premium event equipment.
    </p>
    <button className='px-6 md:px-[50px] lg:px-[72px] py-2 md:py-5 bg-green-600 rounded-lg md:rounded-2xl shadow-sm shadow-green-400 text-white font-bold text-base md:text-xl hover:scale-110 hover:bg-green-700'>Get Started</button>
  </>
);

export const section2 = (
  <div className='md:grid hidden gap-8 grid-cols-1'>
    <div className='rounded-2xl overflow-hidden h-48'>
      <Image
        src='/images/air cooler.jpg'
        alt='hero-1'
        width={300}
        height={300}
        className='img scale-animation'
      />
    </div>

    <div className='grid grid-cols-2 gap-8 h-48'>
      <div className='rounded-2xl overflow-hidden'>
        <Image
          src='/images/High-Velocity_Industrial_Floor_Fan-1.jpg'
          alt='hero-2'
          width={300}
          height={300}
          className='img scale-animation'
        />
      </div>
      <div className='rounded-2xl overflow-hidden'>
        <Image
          src='/images/basket toss.jpg'
          alt='hero-3'
          width={300}
          height={300}
          className='img scale-animation'
        />
      </div>
    </div>
  </div>
);