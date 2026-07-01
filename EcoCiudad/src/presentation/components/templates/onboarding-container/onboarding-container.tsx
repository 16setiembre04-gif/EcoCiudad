import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Button } from '@/components/atoms/button';
import { ThemedText } from '@/components/atoms/text';
import { ProgressIndicator } from '@/components/molecules/progress-indicator';
import { OnboardingScreen } from '@/components/organisms/onboarding-screen';
import { onboardingScreens } from '@/domain/entities/onboarding.entity';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';

const { width } = Dimensions.get('window');

export function OnboardingContainer() {
  const theme = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === onboardingScreens.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const step = Math.round(scrollPosition / width);
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleGetStarted();
    } else {
      const nextStep = currentStep + 1;
      scrollViewRef.current?.scrollTo({
        x: nextStep * width,
        animated: true,
      });
      setCurrentStep(nextStep);
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={handleSkip}>
          <ThemedText type="button" color={theme.colors.textSecondary}>
            Skip
          </ThemedText>
        </Button>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingScreens.map((screen) => (
          <View key={screen.id} style={styles.screenContainer}>
            <OnboardingScreen
              icon={screen.icon}
              title={screen.title}
              description={screen.description}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ProgressIndicator
          totalSteps={onboardingScreens.length}
          currentStep={currentStep}
        />

        <View style={styles.buttonContainer}>
          <Animated.View
            entering={FadeIn.duration(animations.duration.normal)}
            exiting={FadeOut.duration(animations.duration.normal)}
            key={currentStep}
            style={styles.buttonWrapper}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleNext}
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  screenContainer: {
    width,
    flex: 1,
  },
  footer: {
    paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    gap: spacing['2xl'],
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
});
