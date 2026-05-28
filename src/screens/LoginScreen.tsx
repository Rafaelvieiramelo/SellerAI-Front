import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const schema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail obrigatório'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;
type Nav = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { request, promptAsync } = useGoogleAuth(async (token) => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle(token);
    } catch (e: any) {
      Alert.alert('Erro', 'Falha ao entrar com Google');
    } finally {
      setGoogleLoading(false);
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await login(data);
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.message ?? 'Falha ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#0f1923', '#0a1628']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>

        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
          <Text style={styles.title}>SellerAI</Text>
          <Text style={styles.subtitle}>Gere títulos e descrições{'\n'}que vendem mais</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="seu@email.com"
                  placeholderTextColor="#4a5568"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="••••••••"
                  placeholderTextColor="#4a5568"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.buttonGradient}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Entrar</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request || googleLoading}>
            <View style={styles.googleButtonInner}>
              {googleLoading
                ? <ActivityIndicator color="#111" />
                : (
                  <>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.googleButtonText}>Entrar com Google</Text>
                  </>
                )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
            <Text style={styles.linkText}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  badge: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#3b82f6', justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  badgeText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  card: {
    backgroundColor: '#111827', borderRadius: 24,
    padding: 28, borderWidth: 1, borderColor: '#1f2937',
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#1f2937', borderRadius: 12, padding: 16,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#374151',
  },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  button: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  buttonGradient: { padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { color: '#64748b', fontSize: 14 },
  linkBold: { color: '#3b82f6', fontWeight: '700' },

  googleButtonInner: {
  padding: 16,
  alignItems: 'center',
  backgroundColor: '#fff',
  flexDirection: 'row',
  justifyContent: 'center',
},
googleIcon: { 
  fontSize: 16, 
  fontWeight: '800', 
  color: '#4285F4',
  marginRight: 10,
},
dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 16,
},
divider: { flex: 1, height: 1, backgroundColor: '#374151' },
dividerText: { 
  color: '#94a3b8', 
  marginHorizontal: 12, 
  fontSize: 15,
  fontWeight: '600',
  textAlign: 'center'
},
googleButton: {
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#374151',
  overflow: 'hidden',
  marginBottom: 8,
},
googleButtonText: { 
  color: '#111', 
  fontSize: 16, 
  fontWeight: '700' 
},
});