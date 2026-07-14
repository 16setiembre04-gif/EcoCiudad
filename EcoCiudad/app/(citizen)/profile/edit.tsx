import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Button } from '@/presentation/components/atoms/button';
import { Input } from '@/presentation/components/atoms/input';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { useAuthStore } from '@/presentation/stores';
import { useUpdateProfileMutation } from '@/presentation/hooks';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [district, setDistrict] = useState(user?.district ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert(t('common.error'), t('common.nameRequired'));
      return;
    }

    updateProfile(
      {
        displayName: displayName.trim(),
        phone: phone.trim() || undefined,
        department: department.trim() || undefined,
        district: district.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('profile.profileUpdated'), [
            { text: t('common.ok'), onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('common.error'));
        },
      }
    );
  };

  return (
    <DashboardTemplate
      header={
        <Header
          title={t('profile.editProfile')}
          onBackPress={() => router.back()}
        />
      }
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <Avatar uri={avatarUrl} name={displayName} size="xl" />
          </View>

          <Input
            label={t('common.avatarUrl')}
            placeholder={t('common.avatarUrlPlaceholder')}
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            autoCapitalize="none"
          />

          <Input
            label={t('common.displayName')}
            placeholder={t('common.displayNamePlaceholder')}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Input
            label={t('common.phone')}
            placeholder={t('common.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label={t('common.department')}
            placeholder={t('common.yourDepartment')}
            value={department}
            onChangeText={setDepartment}
          />

          <Input
            label={t('common.district')}
            placeholder={t('common.yourDistrict')}
            value={district}
            onChangeText={setDistrict}
          />

          <Button variant="primary" size="lg" onPress={handleSave} loading={isPending}>
            {t('common.save')}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
  },
});
