import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>LavExpress</Text>
            <TextInput style={styles.input} placeholder="Usuário" />
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
            <Button title="Entrar" onPress={() => console.log("Login clicado")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 32,
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});
