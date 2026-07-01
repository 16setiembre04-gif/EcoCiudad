export class AnalyticsService {
  static trackEvent(name: string, properties?: Record<string, unknown>) {
    if (__DEV__) {
      console.log('[Analytics]', name, properties);
    }
  }

  static trackScreen(screenName: string) {
    if (__DEV__) {
      console.log('[Analytics Screen]', screenName);
    }
  }

  static setUser(userId: string, attributes?: Record<string, unknown>) {
    if (__DEV__) {
      console.log('[Analytics User]', userId, attributes);
    }
  }
}
