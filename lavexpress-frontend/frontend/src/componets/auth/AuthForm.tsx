
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthFormProps {
    type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate authentication delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (type === 'login') {
                // Mock successful login
                localStorage.setItem('isAuthenticated', 'true');
                toast.success('Login realizado com sucesso!');
                navigate('/');
            } else {
                // Mock successful signup
                localStorage.setItem('isAuthenticated', 'true');
                toast.success('Conta criada com sucesso!');
                navigate('/');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error(type === 'login' ? 'Falha no login' : 'Falha no cadastro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm mx-auto p-6"
        >
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                    {type === 'login' ? 'Bem-vindo de volta' : 'Criar uma conta'}
                </h1>
                <p className="text-muted-foreground">
                    {type === 'login'
                        ? 'Digite suas credenciais para acessar sua conta'
                        : 'Insira suas informações para criar uma conta'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'signup' && (
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nome Completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder="João Silva"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="voce@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                            Senha
                        </label>
                        {type === 'login' && (
                            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full group"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                        <>
                            {type === 'login' ? 'Entrar' : 'Criar conta'}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                {type === 'login' ? (
                    <p className="text-muted-foreground">
                        Não tem uma conta?{' '}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                ) : (
                    <p className="text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Entrar
                        </Link>
                    </p>
                )}
            </div>
        </motion.div>
    );
}
