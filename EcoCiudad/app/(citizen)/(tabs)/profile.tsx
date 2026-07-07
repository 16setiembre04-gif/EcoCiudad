import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Header } from '@/presentation/components/organisms/header';
import { DashboardTemplate } from '@/presentation/components/templates';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function CitizenProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <DashboardTemplate>
        <View style={styles.loadingContainer}>
          <ThemedText>Cargando perfil...</ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  const handleSettingsPress = () => {
    router.push('/(citizen)/settings');
  };

  const handleEditProfilePress = () => {
    // TODO: Implementar edición de perfil
    console.log('Editar perfil');
  };

  return (
    <DashboardTemplate
      header={
        <Header
          title="Mi Perfil"
          showBackButton={false}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar uri={user.avatarUrl} name={user.displayName} size="xl" />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <ThemedText type="headline" numberOfLines={1}>
                  {user.displayName}
                </ThemedText>
                <Badge variant="tonal" color="primary">
                  Ciudadano
                </Badge>
              </View>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
                {user.email}
              </ThemedText>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.surfaceVariant,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="settings" size={20} color={theme.colors.textPrimary} />
            </View>
          </View>

          <View style={styles.ecoPointsSection}>
            <View style={styles.ecoPointsItem}>
              <Icon name="achievement" size={20} color={theme.colors.primary} />
              <ThemedText type="bodySmall" color={theme.colors.primary}>
                Nivel {user.level ?? 1}
              </ThemedText>
            </View>
            <View style={styles.ecoPointsItem}>
              <Icon name="eco-points" size={20} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {user.ecoPoints ?? 0} puntos
              </ThemedText>
            </View>
          </View>

          <Button
            variant="outlined"
            size="md"
            fullWidth
            onPress={handleEditProfilePress}
            iconName="edit"
          >
            Editar Perfil
          </Button>
        </Card>

        <Card variant="elevated" padding="md" style={styles.statsCard}>
          <ThemedText type="subtitle">Estadísticas</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="report" size={24} color={theme.colors.primary} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                Reportes
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="calendar" size={24} color={theme.colors.secondary} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                Eventos
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="community" size={24} color={theme.colors.success} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                Comunidades
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="achievement" size={24} color={theme.colors.warning} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                Logros
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card variant="elevated" padding="md" style={styles.actionsCard}>
          <ThemedText type="subtitle">Acciones</ThemedText>
          <View style={styles.actionsList}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={handleSettingsPress}
              iconName="settings"
              iconPosition="left"
            >
              Configuración
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => console.log('Mis reportes')}
              iconName="report"
              iconPosition="left"
            >
              Mis Reportes
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => console.log('Mis eventos')}
              iconName="calendar"
              iconPosition="left"
            >
              Mis Eventos
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => console.log('Mis comunidades')}
              iconName="community"
              iconPosition="left"
            >
              Mis Comunidades
            </Button>
          </View>
        </Card>

        <Card variant="elevated" padding="md" style={styles.logoutCard}>
          <Button
            variant="destructive"
            size="md"
            fullWidth
            onPress={() => console.log('Cerrar sesión')}
            iconName="logout"
            iconPosition="left"
          >
            Cerrar Sesión
          </Button>
        </Card>
      </ScrollView>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    gap: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ecoPointsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  ecoPointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statsCard: {
    gap: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 80,
  },
  actionsCard: {
    gap: spacing.md,
  },
  actionsList: {
    gap: spacing.sm,
  },
  logoutCard: {
    marginTop: spacing.md,
  },
});
