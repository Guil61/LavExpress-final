
import { Star, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CarWashService {
    id: string;
    name: string;
    image: string;
    rating: number;
    price: number;
    distance: string;
    address: string;
    openTime: string;
    closeTime: string;
}

interface CarWashCardProps {
    service: CarWashService;
    onClick: (id: string) => void;
}

export default function CarWashCard({ service, onClick }: CarWashCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm"
            onClick={() => onClick(service.id)}
        >
            <div className="relative h-40">
                <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    {service.distance}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{service.name}</h3>
                    <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{service.address}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{service.openTime} - {service.closeTime}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-primary font-bold">
                        R${service.price}
                        <span className="text-xs font-normal text-muted-foreground ml-1">preço inicial</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
