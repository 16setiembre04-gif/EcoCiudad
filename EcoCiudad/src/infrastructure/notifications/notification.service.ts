import messaging from '@react-native-firebase/messaging';

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  static async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch {
      return null;
    }
  }

  static onMessage(callback: (message: unknown) => void) {
    return messaging().onMessage(callback as never);
  }

  static onNotificationOpenedApp(callback: (message: unknown) => void) {
    return messaging().onNotificationOpenedApp(callback as never);
  }

  static async getInitialNotification(): Promise<unknown> {
    return messaging().getInitialNotification();
  }

  static async subscribeToTopic(topic: string): Promise<void> {
    await messaging().subscribeToTopic(topic);
  }

  static async unsubscribeFromTopic(topic: string): Promise<void> {
    await messaging().unsubscribeFromTopic(topic);
  }
}
