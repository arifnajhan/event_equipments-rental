import Image from 'next/image';

const Gallery = () => {
  return (
    <div className='mx-auto container py-14 h-full'>
      <div className='flex flex-wrap md:-m-2'>
        <div className='flex w-1/2 flex-wrap'>
          <div className='w-1/2 p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/air cooler.jpg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
          <div className='w-1/2 p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/ballon dart.jpg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
          <div className='w-full p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/ring toss.jpeg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
        </div>
        <div className='flex w-1/2 flex-wrap'>
          <div className='w-full p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/khemah.jpeg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
          <div className='w-1/2 p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/basket toss.jpg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
          <div className='w-1/2 p-1 md:p-2 h-48'>
            <Image
              alt='gallery'
              className='img'
              src='/images/cans toss.jpg'
              width={200}
              height={200}
              quality={85}
              sizes="(max-width: 768px) 100vw, 288px"
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;