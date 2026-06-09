import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar, ScrollView, useWindowDimensions, Pressable
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
import { AIButton } from '../../../../components/DesignSystem';

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

  // Focus and Hover States
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const getIcon = (field: 'name' | 'email' | 'password') => {
    if (field === 'name') return '👤';
    if (field === 'email') return '📧';
    return '🔒';
  };

  const getLabel = (field: 'name' | 'email' | 'password') => {
    if (field === 'name') return 'Nome';
    if (field === 'email') return 'E-mail';
    return 'Senha';
  };

  const renderForm = (isMobile: boolean) => (
    <View style={[styles.card, !isMobile && styles.desktopCard]}>
      <Text style={styles.cardTitle}>Cadastro</Text>

      {(['name', 'email', 'password'] as const).map((field) => (
        <Controller
          key={field}
          control={control}
          name={field}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{getLabel(field)}</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === field && styles.inputWrapperFocused,
                errors[field] && styles.inputWrapperError
              ]}>
                <Text style={styles.inputFieldIcon}>{getIcon(field)}</Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={field === 'name' ? 'Seu nome' : field === 'email' ? 'seu@email.com' : '••••••••'}
                  placeholderTextColor={colors.textTertiary}
                  keyboardType={field === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={field === 'name' ? 'words' : 'none'}
                  secureTextEntry={field === 'password'}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              {errors[field] && <Text style={styles.error}>{errors[field]?.message}</Text>}
            </View>
          )}
        />
      ))}

      <AIButton
        title={loading ? 'Criando conta...' : 'Criar conta'}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        loading={loading}
        fullWidth
        style={styles.submitButton}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>✨</Text>
                </LinearGradient>
                <Text style={styles.title}>Criar conta</Text>
                <Text style={styles.subtitle}>IA para vender mais no{'\n'}Mercado Livre e Shopee.</Text>
              </View>

              {renderForm(true)}
            </ScrollView>
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
    padding: spacing[6],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[6],
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
    marginBottom: spacing[10],
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
});
