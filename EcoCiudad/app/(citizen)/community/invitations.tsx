import { View } from 'react-native';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { spacing } from '@/theme/spacing';

export default function CommunityInvitationsScreen() {
  return (
    <CommunityTemplate
      header={
        <Header title="Invitations" showBackButton />
      }
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
        <EmptyState
          iconName="community"
          title="No Invitations"
          description="You don't have any pending community invitations"
        />
      </View>
    </CommunityTemplate>
  );
}
