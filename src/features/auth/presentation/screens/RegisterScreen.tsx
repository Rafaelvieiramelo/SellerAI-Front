import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar, ScrollView, useWindowDimensions
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
import { AIButton } from '../../../../components/DesignSystem';
import { styles } from './RegisterScreen.styles';

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


