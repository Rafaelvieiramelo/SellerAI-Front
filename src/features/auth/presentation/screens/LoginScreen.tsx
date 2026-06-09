import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar, useWindowDimensions, Pressable
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
import { AIButton } from '../../../../components/DesignSystem';

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
  const passwordInputRef = useRef<TextInput>(null);

  // Focus and Hover States
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const renderForm = (isMobile: boolean) => (
    <View style={[styles.card, !isMobile && styles.desktopCard]}>
      <Text style={styles.cardTitle}>Entrar</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
              errors.email && styles.inputWrapperError
            ]}>
              <Text style={styles.inputFieldIcon}>📧</Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                returnKeyType="next"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
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
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused,
              errors.password && styles.inputWrapperError
            ]}>
              <Text style={styles.inputFieldIcon}>🔒</Text>
              <TextInput
                ref={passwordInputRef}
                style={styles.textInputStyle}
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                returnKeyType="done"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            </View>
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <AIButton
        title={loading ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        loading={loading}
        fullWidth
        style={styles.submitButton}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        onPress={() => promptAsync()}
        disabled={!request || googleLoading}
        style={({ pressed, hovered }) => [
          styles.googleButton,
          pressed && styles.pressed,
          hovered && styles.googleButtonHover
        ]}
      >
        <View style={styles.googleButtonInner}>
          {googleLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Entrar com Google</Text>
            </>
          )}
        </View>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={styles.linkText}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {isDesktop ? (
        <View style={styles.webContainer}>
          <LinearGradient colors={['#0B1120', '#111827', '#0F172A']} style={styles.visualPane}>
            {/* Ambient Background Glows */}
            <View style={styles.glowOverlay1} />
            <View style={styles.glowOverlay2} />

            <View style={styles.visualContent}>
              <View style={styles.logoRow}>
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoBadge}
                >
                  <Text style={styles.logoBadgeText}>✨</Text>
                </LinearGradient>
                <Text style={styles.visualTitle}>SellerAI</Text>
              </View>
              
              <Text style={styles.visualSubtitle}>
                Crie anúncios otimizados por IA e aumente suas vendas nos marketplaces.
              </Text>

              {/* Benefits Checklist */}
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.benefitText}>Gere títulos otimizados</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.benefitText}>Crie descrições persuasivas</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.benefitText}>Publique mais rápido</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.benefitText}>Venda mais no Mercado Livre e Shopee</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          <View style={styles.formPane}>
            <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
              {renderForm(false)}
            </KeyboardAvoidingView>
          </View>
        </View>
      ) : (
        <LinearGradient colors={['#0B1120', '#111827']} style={styles.mobileContainer}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
            <View style={styles.header}>
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>✨</Text>
              </LinearGradient>
              <Text style={styles.title}>SellerAI</Text>
              <Text style={styles.subtitle}>IA para vender mais no{'\n'}Mercado Livre e Shopee.</Text>
            </View>

            {renderForm(true)}
          </KeyboardAvoidingView>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  visualPane: {
    flex: 1.2,
    justifyContent: 'center',
    padding: spacing[12],
    position: 'relative',
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: colors.borderDefault,
  },
  glowOverlay1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    ...Platform.select({
      web: { filter: 'blur(80px)' },
      default: null,
    }),
  },
  glowOverlay2: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    ...Platform.select({
      web: { filter: 'blur(100px)' },
      default: null,
    }),
  },
  visualContent: {
    maxWidth: 480,
    alignSelf: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
      default: null,
    }),
  },
  logoBadgeText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  visualTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -1,
  },
  visualSubtitle: {
    color: colors.textSecondary,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: spacing[2],
    marginBottom: spacing[8],
  },
  benefitsList: {
    gap: spacing[4],
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  checkIcon: {
    color: '#3B82F6',
    fontWeight: '900',
    fontSize: 16,
  },
  benefitText: {
    color: colors.textSecondary,
    ...typography.bodyLg,
    fontWeight: '600',
  },
  formPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    padding: spacing[8],
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
  },
  desktopCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii['2xl'],
    padding: spacing[8],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    ...Platform.select({
      web: { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' },
      default: null,
    }),
  },
  mobileContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  badgeText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: 22,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii['2xl'],
    padding: spacing[6] + 4,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  cardTitle: {
    ...typography.h2,
    marginBottom: spacing[6],
    color: colors.white,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: spacing[5],
  },
  label: {
    ...typography.bodySm,
    color: colors.textTertiary,
    marginBottom: spacing[2],
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    paddingHorizontal: spacing[4],
    height: 48,
    ...Platform.select({
      web: { transition: 'all 200ms ease' },
      default: null,
    }),
  },
  inputWrapperFocused: {
    borderColor: '#3B82F6',
    ...Platform.select({
      web: { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
      default: null,
    }),
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputFieldIcon: {
    fontSize: 16,
    marginRight: spacing[3],
    color: colors.textTertiary,
  },
  textInputStyle: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 15,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: null,
    }),
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing[1],
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing[2],
  },
  link: {
    alignItems: 'center',
    marginTop: spacing[5],
  },
  linkText: {
    color: colors.textTertiary,
    ...typography.body,
  },
  linkBold: {
    color: colors.brandPrimary,
    fontWeight: '700',
  },
  googleButton: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgInput,
    overflow: 'hidden',
    marginBottom: spacing[2],
    height: 48,
    justifyContent: 'stretch',
    alignItems: 'stretch',
    ...Platform.select({
      web: { transition: 'all 200ms ease' },
      default: null,
    }),
  },
  googleButtonHover: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurfaceHover,
  },
  googleButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#3B82F6',
    marginRight: 10,
  },
  googleButtonText: {
    color: colors.textSecondary,
    ...typography.bodyLg,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderDefault,
  },
  dividerText: {
    color: colors.textTertiary,
    marginHorizontal: spacing[3],
    ...typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
