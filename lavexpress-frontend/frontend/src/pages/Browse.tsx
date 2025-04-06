
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Star, TrendingUp, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CarWashCard, { CarWashService } from '@/components/car-wash/CarWashCard';

const MOCK_SERVICES: CarWashService[] = [
  {
    id: '1',
    name: 'Lavagem Premium',
    image: 'https://images.unsplash.com/photo-1545327521-8b4b5d6bc605?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    price: 25,
    distance: '1.2 km',
    address: 'Rua Principal, 123',
    openTime: '8:00',
    closeTime: '20:00',
  },
  {
    id: '2',
    name: 'Rápido & Limpo',
    image: 'https://images.unsplash.com/photo-1552149826-c1e99c724cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    rating: 4.5,
    price: 18,
    distance: '0.8 km',
    address: 'Avenida Parque, 456',
    openTime: '7:00',
    closeTime: '22:00',
  },
  {
    id: '3',
    name: 'Lavagem Ecológica',
    image: 'https://images.unsplash.com/photo-1596257520714-f184ee2a0aa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    price: 30,
    distance: '2.5 km',
    address: 'Rua Verde, 789',
    openTime: '9:00',
    closeTime: '19:00',
  },
  {
    id: '4',
    name: 'Auto Spa de Luxo',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    price: 45,
    distance: '3.1 km',
    address: 'Alameda Luxo, 101',
    openTime: '8:00',
    closeTime: '18:00',
  },
  {
    id: '5',
    name: 'Lavagem Expressa',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    rating: 4.3,
    price: 15,
    distance: '0.5 km',
    address: 'Rua Rápida, 202',
    openTime: '6:00',
    closeTime: '23:00',
  },
];

type FilterOption = 'all' | 'nearest' | 'rating' | 'price';

export default function Browse() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  
  const filterOptions = [
    { id: 'all', label: 'Todos', icon: Filter },
    { id: 'nearest', label: 'Mais Próximos', icon: TrendingUp },
    { id: 'rating', label: 'Melhor Avaliação', icon: Star },
    { id: 'price', label: 'Melhor Preço', icon: Tag },
  ];
  
  const filteredServices = () => {
    let filtered = [...MOCK_SERVICES];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    switch (activeFilter) {
      case 'nearest':
        filtered.sort((a, b) => 
          parseFloat(a.distance) - parseFloat(b.distance)
        );
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    
    return filtered;
  };
  
  const handleServiceClick = (id: string) => {
    navigate(`/schedule?serviceId=${id}`);
  };

  return (
    <MobileLayout title="Buscar Serviços" showBackButton>
      <div className="p-4 space-y-4">
        <div className="relative">
          <Input
            placeholder="Buscar serviços de lavagem"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-secondary border-transparent"
          />
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.id;
            
            return (
              <Button
                key={option.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`flex items-center rounded-full ${
                  isActive ? "" : "bg-secondary border-transparent"
                }`}
                onClick={() => setActiveFilter(option.id as FilterOption)}
              >
                <Icon className="h-3.5 w-3.5 mr-1" />
                {option.label}
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-4 pb-4">
          {filteredServices().map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CarWashCard
                service={service}
                onClick={handleServiceClick}
              />
            </motion.div>
          ))}
          
          {filteredServices().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum resultado encontrado</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
