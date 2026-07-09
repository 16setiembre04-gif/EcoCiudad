import { View } from 'react-native';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

export default function CommunityInvitationsScreen() {
  const { t } = useTranslation();

  return (
    <CommunityTemplate
      header={
        <Header title={t('common.invitations')} showBackButton />
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
        <EmptyState
          iconName="community"
          title={t('common.noInvitations')}
          description={t('common.noPendingInvitations')}
        />
      </View>
    </CommunityTemplate>
  );
}
