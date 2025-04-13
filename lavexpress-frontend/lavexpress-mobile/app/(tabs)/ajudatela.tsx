// app/ajudatela.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    TextInput,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function AjudaTelaScreen() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState("");
    const [categoriaAberta, setCategoriaAberta] = useState("");

    // Lista de perguntas frequentes
    const faqCategories = [
        {
            id: "conta",
            titulo: "Conta e Perfil",
            perguntas: [
                {
                    pergunta: "Como altero minha senha?",
                    resposta: "Para alterar sua senha, acesse a tela de Perfil, toque em 'Editar Perfil' e vá até a seção 'Alterar Senha'. Preencha os campos de nova senha e confirmação, depois toque em 'Salvar'."
                },
                {
                    pergunta: "Como excluir minha conta?",
                    resposta: "Para excluir sua conta, entre em contato com nosso suporte através da seção 'Entrar em Contato' abaixo. Nossa equipe irá orientá-lo sobre o processo de exclusão de conta."
                }
            ]
        },
        {
            id: "agendamento",
            titulo: "Agendamentos",
            perguntas: [
                {
                    pergunta: "Como agendar uma lavagem?",
                    resposta: "Para agendar uma lavagem, selecione o lava-jato desejado, escolha o serviço, data e horário disponíveis e confirme o agendamento. Você pode acompanhar todos os seus agendamentos na aba 'Agenda'."
                },
                {
                    pergunta: "Como cancelar um agendamento?",
                    resposta: "Para cancelar um agendamento, acesse a aba 'Agenda', encontre o agendamento que deseja cancelar e toque no botão 'Cancelar'. Lembre-se que alguns lava-jatos podem ter políticas de cancelamento específicas."
                },
                {
                    pergunta: "Posso remarcar um agendamento?",
                    resposta: "Sim! Para remarcar, acesse a aba 'Agenda', encontre o agendamento desejado e toque em 'Remarcar'. Você poderá escolher uma nova data e horário conforme a disponibilidade."
                }
            ]
        },
        {
            id: "pagamento",
            titulo: "Pagamentos",
            perguntas: [
                {
                    pergunta: "Quais formas de pagamento são aceitas?",
                    resposta: "As formas de pagamento variam de acordo com cada lava-jato. Na maioria dos casos, são aceitos pagamentos via cartão de crédito/débito, PIX e dinheiro. As opções disponíveis são exibidas no momento do agendamento."
                },
                {
                    pergunta: "Como solicitar reembolso?",
                    resposta: "Para solicitar um reembolso, entre em contato com nosso suporte pelo formulário abaixo, informando o número do agendamento e o motivo do reembolso. Cada caso será analisado conforme as políticas do lava-jato."
                }
            ]
        },
        {
            id: "app",
            titulo: "Sobre o Aplicativo",
            perguntas: [
                {
                    pergunta: "Como atualizar o aplicativo?",
                    resposta: "O aplicativo pode ser atualizado através da loja de aplicativos do seu dispositivo (App Store para iOS ou Google Play para Android). Recomendamos manter o app sempre atualizado para acessar as novas funcionalidades."
                },
                {
                    pergunta: "O aplicativo funciona offline?",
                    resposta: "Não, é necessário uma conexão com internet para utilizar todas as funcionalidades do LavExpress, como buscar lava-jatos, realizar agendamentos e visualizar seu perfil."
                }
            ]
        }
    ];

    // Função para enviar mensagem de suporte
    const enviarMensagem = () => {
        if (!mensagem.trim()) {
            Alert.alert("Erro", "Por favor, digite sua mensagem antes de enviar.");
            return;
        }

        // Simulação de envio da mensagem
        Alert.alert(
            "Mensagem Enviada",
            "Agradecemos seu contato! Responderemos em até 24 horas úteis.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        setMensagem("");
                    }
                }
            ]
        );
    };

    // Função para expandir/recolher uma categoria
    const toggleCategoria = (categoriaId) => {
        if (categoriaAberta === categoriaId) {
            setCategoriaAberta("");
        } else {
            setCategoriaAberta(categoriaId);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Espaçamento para evitar sobreposição com a status bar */}
            <View style={styles.statusBarSpacer} />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0077cc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Seção de Perguntas Frequentes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>

                    {faqCategories.map((categoria) => (
                        <View key={categoria.id} style={styles.faqCategory}>
                            <TouchableOpacity
                                style={styles.faqCategoryHeader}
                                onPress={() => toggleCategoria(categoria.id)}
                            >
                                <Text style={styles.faqCategoryTitle}>{categoria.titulo}</Text>
                                <Ionicons
                                    name={categoriaAberta === categoria.id ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#0077cc"
                                />
                            </TouchableOpacity>

                            {categoriaAberta === categoria.id && (
                                <View style={styles.faqItems}>
                                    {categoria.perguntas.map((item, index) => (
                                        <View key={index} style={styles.faqItem}>
                                            <Text style={styles.faqQuestion}>{item.pergunta}</Text>
                                            <Text style={styles.faqAnswer}>{item.resposta}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Formulário de Contato */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Entrar em Contato</Text>
                    <Text style={styles.contactInfo}>
                        Não encontrou o que procurava? Envie sua dúvida ou problema para nossa equipe de suporte.
                    </Text>

                    <View style={styles.contactForm}>
                        <Text style={styles.inputLabel}>Mensagem</Text>
                        <View style={styles.textAreaContainer}>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={6}
                                placeholder="Descreva sua dúvida ou problema em detalhes..."
                                value={mensagem}
                                onChangeText={setMensagem}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={enviarMensagem}
                        >
                            <Text style={styles.sendButtonText}>Enviar Mensagem</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Outras formas de contato */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contato Direto</Text>

                    <View style={styles.contactOption}>
                        <View style={styles.contactIconContainer}>
                            <Ionicons name="mail" size={24} color="#0077cc" />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactType}>E-mail</Text>
                            <Text style={styles.contactValue}>suporte@lavexpress.com</Text>
                        </View>
                    </View>

                    <View style={styles.contactOption}>
                        <View style={styles.contactIconContainer}>
                            <Ionicons name="call" size={24} color="#0077cc" />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactType}>Telefone</Text>
                            <Text style={styles.contactValue}>(61) 3333-4444</Text>
                            <Text style={styles.contactHours}>Seg a Sex: 8h às 18h</Text>
                        </View>
                    </View>

                    <View style={styles.contactOption}>
                        <View style={styles.contactIconContainer}>
                            <Ionicons name="logo-whatsapp" size={24} color="#0077cc" />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactType}>WhatsApp</Text>
                            <Text style={styles.contactValue}>(61) 98888-7777</Text>
                            <Text style={styles.contactHours}>Atendimento 24h</Text>
                        </View>
                    </View>
                </View>

                {/* Espaçamento no final */}
                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    statusBarSpacer: {
        height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 25,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: "white",
        padding: 16,
        marginTop: 12,
        borderRadius: 8,
        marginHorizontal: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    faqCategory: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        overflow: "hidden",
    },
    faqCategoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    faqCategoryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    faqItems: {
        padding: 16,
        backgroundColor: "white",
    },
    faqItem: {
        marginBottom: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0077cc",
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    contactInfo: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
        lineHeight: 20,
    },
    contactForm: {
        marginTop: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        marginBottom: 16,
    },
    textArea: {
        padding: 12,
        fontSize: 16,
        color: "#333",
        minHeight: 120,
    },
    sendButton: {
        backgroundColor: "#0077cc",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    sendButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    contactOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    contactIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#e6f3fb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    contactDetails: {
        flex: 1,
    },
    contactType: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 15,
        color: "#0077cc",
        marginBottom: 2,
    },
    contactHours: {
        fontSize: 13,
        color: "#999",
    },
});