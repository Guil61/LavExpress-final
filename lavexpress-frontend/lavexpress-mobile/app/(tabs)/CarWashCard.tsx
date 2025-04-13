// app/(tabs)/CarWashCard.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Animated,
    AccessibilityInfo
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CarWashCardProps = {
    service: {
        id: string;
        name: string;
        image: string;
        rating: number;
        price: number;
        distance: string;
        address: string;
        openTime: string;
        closeTime: string;
    };
    onPress?: (id: string) => void;
};

const CarWashCard = React.memo(({ service, onPress }: CarWashCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [pressAnim] = useState(new Animated.Value(1));

    if (!service) return null;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(pressAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pressAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onPress?.(service.id);
        });
    };

    const renderRatingStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#ffb700" />);
            } else if (i === fullStars && halfStar) {
                stars.push(<Ionicons key={`star-${i}`} name="star-half" size={14} color="#ffb700" />);
            } else {
                stars.push(<Ionicons key={`star-${i}`} name="star-outline" size={14} color="#ffb700" />);
            }
        }

        return stars;
    };

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: pressAnim }] }]}>
            <Pressable
                style={styles.card}
                onPress={handlePress}
                accessible={true}
                accessibilityLabel={`${service.name}, Avaliação ${service.rating} estrelas, Preço R$${service.price}, Distância ${service.distance}, Aberto das ${service.openTime} às ${service.closeTime}`}
                accessibilityRole="button"
            >
                {!imageError ? (
                    <Image
                        source={{ uri: service.image }}
                        style={styles.image}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Ionicons name="car-sport" size={40} color="#ccc" />
                        <Text style={styles.imagePlaceholderText}>Imagem indisponível</Text>
                    </View>
                )}

                <View style={styles.details}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {service.name}
                    </Text>

                    <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
                        <Ionicons name="location-outline" size={12} color="#666" />
                        {' '}{service.address}
                    </Text>

                    <View style={styles.ratingRow}>
                        <View style={styles.starsContainer}>
                            {renderRatingStars(service.rating)}
                        </View>
                        <Text style={styles.rating}>{service.rating.toFixed(1)}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.price}>R${service.price}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.distance}>{service.distance}</Text>
                    </View>

                    <View style={styles.scheduleContainer}>
                        <Ionicons name="time-outline" size={12} color="#0077cc" />
                        <Text style={styles.hours}>
                            {service.openTime} - {service.closeTime}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        height: 160,
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: '#999',
        marginTop: 8,
        fontSize: 14,
    },
    details: {
        padding: 16,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
        marginBottom: 6,
    },
    address: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 4,
    },
    rating: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    dot: {
        color: '#ccc',
        marginHorizontal: 4,
        fontSize: 14,
    },
    price: {
        color: '#0077cc',
        fontSize: 14,
        fontWeight: '500',
    },
    distance: {
        color: '#666',
        fontSize: 14,
    },
    scheduleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f7ff',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    hours: {
        marginLeft: 4,
        fontSize: 13,
        color: '#0077cc',
        fontWeight: '500',
    },
});

export default CarWashCard;