
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import DateTimeSelector from '@/components/scheduling/DateTimeSelector';
import { toast } from 'sonner';
import { CarWashService } from '@/components/car-wash/CarWashCard';

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
];

type WashType = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function Schedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedService, setSelectedService] = useState<CarWashService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedWashType, setSelectedWashType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Extract serviceId from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const serviceId = searchParams.get('serviceId');
  
  // Wash types
  const washTypes: WashType[] = [
    {
      id: 'basic',
      name: 'Lavagem Básica',
      description: 'Lavagem externa com água e sabão',
      price: 15
    },
    {
      id: 'deluxe',
      name: 'Lavagem Deluxe',
      description: 'Lavagem básica + cera e brilho nos pneus',
      price: 25
    },
    {
      id: 'premium',
      name: 'Detalhamento Premium',
      description: 'Lavagem deluxe + limpeza interna',
      price: 40
    }
  ];
  
  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
    
    // Find the selected service
    if (serviceId) {
      const service = MOCK_SERVICES.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [serviceId]);
  
  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };
  
  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Por favor, faça login para agendar');
      navigate('/login');
      return;
    }
    
    if (!selectedWashType || !selectedDate || !selectedTime) {
      toast.error('Por favor, selecione um tipo de lavagem, data e horário');
      return;
    }
    
    // Simulate booking process
    toast.success('Agendamento realizado com sucesso!');
    navigate('/profile');
  };

  return (
    <MobileLayout title="Agendar Serviço" showBackButton>
      <div className="p-4 space-y-6">
        {selectedService && (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={selectedService.image}
              alt={selectedService.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{selectedService.name}</h2>
              <p className="text-muted-foreground text-sm">{selectedService.address}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="font-medium">Selecionar Tipo de Lavagem</h3>
          <div className="space-y-3">
            {washTypes.map((type) => {
              const isSelected = selectedWashType === type.id;
              
              return (
                <motion.div
                  key={type.id}
                  whileTap={{ scale: 0.98 }}
                  className={`flex justify-between items-center p-4 rounded-xl border ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedWashType(type.id)}
                >
                  <div>
                    <h4 className="font-medium">{type.name}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-base mr-3">R${type.price}</span>
                    {isSelected && <Check className="text-primary h-5 w-5" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <DateTimeSelector onSelect={handleDateTimeSelect} />
        
        <div className="pt-4">
          <Button 
            onClick={handleBooking}
            disabled={!selectedWashType || !selectedDate || !selectedTime}
            className="w-full group"
          >
            Confirmar Agendamento
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
