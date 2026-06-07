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
import { RootStackParamList } from '../../../../navigation/AppNavigator';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { spacing } from '../../../../theme/spacing';
import { radii } from '../../../../theme/radii';

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
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      loading || setLoading(true);
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
    <LinearGradient colors={[colors.bgPrimary, '#0f1923', '#0a1628']} style={styles.container}>
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
                      placeholderTextColor={colors.textTertiary}
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
              <LinearGradient colors={[colors.brandPrimary, colors.brandHover]} style={styles.buttonGradient}>
                {loading
                  ? <ActivityIndicator color={colors.white} />
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
  inner: { flex: 1, padding: spacing[6] },
  header: { alignItems: 'center', marginTop: spacing[10] + spacing[5], marginBottom: spacing[10] },
  badge: {
    width: 56, height: 56, borderRadius: radii.xl,
    backgroundColor: colors.brandPrimary, justifyContent: 'center',
    alignItems: 'center', marginBottom: spacing[4],
  },
  badgeText: { color: colors.white, fontSize: 20, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -1 },
  subtitle: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing[2], lineHeight: 22 },
  card: {
    backgroundColor: colors.bgSurface, borderRadius: radii['2xl'],
    padding: spacing[6] + 4, borderWidth: 1, borderColor: colors.borderDefault, marginBottom: spacing[10],
  },
  cardTitle: { ...typography.h1, marginBottom: spacing[6] },
  inputGroup: { marginBottom: spacing[4] },
  label: { ...typography.bodySm, color: colors.textTertiary, marginBottom: spacing[2], fontWeight: '500' },
  input: {
    backgroundColor: colors.bgInput, borderRadius: radii.xl, padding: spacing[4],
    color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.borderDefault,
  },
  inputError: { borderColor: colors.error },
  error: { ...typography.caption, color: colors.error, marginTop: spacing[1] },
  button: { borderRadius: radii.xl, overflow: 'hidden', marginTop: spacing[2] },
  buttonGradient: { padding: spacing[4], alignItems: 'center' },
  buttonText: { color: colors.white, ...typography.bodyLg, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: spacing[5] },
  linkText: { color: colors.textTertiary, ...typography.body },
  linkBold: { color: colors.brandPrimary, fontWeight: '700' },
});
