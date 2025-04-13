import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme() || 'light';

    return (
        <PaperProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors[colorScheme].tint,
                    tabBarButton: HapticTab,
                    tabBarBackground: TabBarBackground,
                    tabBarStyle: Platform.select({
                        ios: {
                            position: 'absolute',
                        },
                        android: {
                            backgroundColor: '#fff',
                            elevation: 10,
                        },
                        default: {},
                    }),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                    }}
                />
            </Tabs>
        </PaperProvider>
    );
}
