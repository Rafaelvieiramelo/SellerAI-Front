import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;
type Nav = StackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);

 const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: '',
    email: '',
    password: '',
  },
});

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await register(data);
      Alert.alert('Sucesso', 'Conta criada! Faça login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e: any) {
      const msgs = e?.response?.data?.errors;
      Alert.alert('Erro', Array.isArray(msgs) ? msgs.join('\n') : 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#0f1923', '#0a1628']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AI</Text>
            </View>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Comece a gerar descrições{'\n'}incríveis para seus produtos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cadastro</Text>

            {(['name', 'email', 'password'] as const).map((field) => (
              <Controller
                key={field}
                control={control}
                name={field}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {field === 'name' ? 'Nome' : field === 'email' ? 'E-mail' : 'Senha'}
                    </Text>
                    <TextInput
                      style={[styles.input, errors[field] && styles.inputError]}
                      placeholder={field === 'name' ? 'Seu nome' : field === 'email' ? 'seu@email.com' : '••••••••'}
                      placeholderTextColor="#4a5568"
                      keyboardType={field === 'email' ? 'email-address' : 'default'}
                      autoCapitalize={field === 'name' ? 'words' : 'none'}
                      secureTextEntry={field === 'password'}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors[field] && <Text style={styles.error}>{errors[field]?.message}</Text>}
                  </View>
                )}
              />
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.buttonGradient}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.buttonText}>Criar conta</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
              <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
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
    padding: 28, borderWidth: 1, borderColor: '#1f2937', marginBottom: 40,
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
});