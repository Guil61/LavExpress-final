// LavaJatosPorServico.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CarWashCard from './CarWashCard';
import { Feather } from '@expo/vector-icons';

const MOCK_SERVICES = [
    {
        id: '1',
        name: 'Lavagem Premium',
        image: 'https://images.unsplash.com/photo-1545327521-8b4b5d6bc605?auto=format&fit=crop&w=500&q=80',
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
        image: 'https://images.unsplash.com/photo-1552149826-c1e99c724cd1?auto=format&fit=crop&w=500&q=80',
        rating: 4.5,
        price: 18,
        distance: '0.8 km',
        address: 'Avenida Parque, 456',
        openTime: '7:00',
        closeTime: '22:00',
    },
];

export default function LavaJatosPorServico({ route }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    const filteredServices = MOCK_SERVICES.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FFF', padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Lava Jatos disponíveis</Text>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#DDD',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    marginBottom: 20,
                }}
            >
                <Feather name="search" size={16} color="gray" />
                <TextInput
                    placeholder="Buscar lava jatos..."
                    style={{ marginLeft: 8, flex: 1 }}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {filteredServices.map((service) => (
                <CarWashCard
                    key={service.id}
                    service={service}
                    onPress={() => navigation.navigate('Agendamento', { service })}
                />
            ))}
        </ScrollView>
    );
}
