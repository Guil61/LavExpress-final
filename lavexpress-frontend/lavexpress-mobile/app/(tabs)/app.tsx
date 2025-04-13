// App.js ou o arquivo onde você configura suas rotas
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './home';
import ServicoEspecifico from './ServicoEspecifico';
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ServicoEspecifico" component={ServicoEspecifico} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}