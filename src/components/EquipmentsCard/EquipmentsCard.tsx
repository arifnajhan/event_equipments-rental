import { Equipment } from "@/models/equipments";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
    equipment: Equipment;
};

const EquipmentsCard: FC<Props> = (props) => {
    const {
        equipment: { coverImage, name, price, type, description, slug, isBooked },
    } = props;

    return (
        <div className="rounded-xl w-72 mb-10 mx-auto md:mx-0 overflow-hidden text-black">
            <div className="h-60 overflow-hidden">
            <Image
                src={coverImage.url}
                alt={name}
                width={600}
                height={400}
                className="img scale-animation object-cover w-full h-full"
                quality={85}
                sizes="(max-width: 768px) 100vw, 288px"
                priority={true}
            />
            </div>

            <div className="p-4 bg-white">
                <div className="flex items-center justify-center text-l font-semibold">
                    <p className="text-x">{name}</p>
                </div>
                <p className="flex items-center justify-center text-l font-semibold">RM {price}</p>

                <p className="pt-2 text-xs">{type} Equipments</p>

                <p className="pt-3 pb-6 text-s">{description.slice(1, 300)}...</p>

                {isBooked ? (
                    <span
                        className="inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold bg-red-600 cursor-not-allowed"
                    >
                        BOOKED
                    </span>
                ) : (
                    <Link
                        href={`/equipments/${slug.current}`}
                        className="inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold hover:-translate-y-2 hover:shadow-lg transition-all duration-500 bg-green-700"
                    >
                        BOOK NOW
                    </Link>
                )}
            </div>
        </div>
    );
};

export default EquipmentsCard;