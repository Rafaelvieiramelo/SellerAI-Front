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
import { RootStackParamList } from '../../../../navigation/AppNavigator';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { spacing } from '../../../../theme/spacing';
import { radii } from '../../../../theme/radii';

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
    defaultValues: { email: '', password: '' },
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
    <LinearGradient colors={[colors.bgPrimary, '#0f1923', '#0a1628']} style={styles.container}>
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
                  placeholderTextColor={colors.textTertiary}
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
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
            <LinearGradient colors={[colors.brandPrimary, colors.brandHover]} style={styles.buttonGradient}>
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.buttonText}>Entrar</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request || googleLoading}>
            <View style={styles.googleButtonInner}>
              {googleLoading
                ? <ActivityIndicator color={colors.bgSurface} />
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
  inner: { flex: 1, justifyContent: 'center', padding: spacing[6] },
  header: { alignItems: 'center', marginBottom: spacing[10] },
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
    padding: spacing[6] + 4, borderWidth: 1, borderColor: colors.borderDefault,
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
  googleButtonInner: {
    padding: spacing[4], alignItems: 'center', backgroundColor: colors.white,
    flexDirection: 'row', justifyContent: 'center',
  },
  googleIcon: { fontSize: 16, fontWeight: '800', color: '#4285F4', marginRight: 10 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing[4] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderDefault },
  dividerText: { color: colors.textTertiary, marginHorizontal: spacing[3], ...typography.bodyLg, fontWeight: '600', textAlign: 'center' },
  googleButton: {
    borderRadius: radii.xl, borderWidth: 1, borderColor: colors.borderDefault,
    overflow: 'hidden', marginBottom: spacing[2],
  },
  googleButtonText: { color: colors.bgSurface, ...typography.bodyLg, fontWeight: '700' },
});
