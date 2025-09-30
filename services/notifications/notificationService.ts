import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e) {
    console.log('getExpoPushToken error:', e);
  }

  return token;
};

export const schedulePushNotification = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
  });
};

export const sendLocalNotification = async (title: string, body: string) => {
  const plainBody = typeof body === 'string' ? body.replace(/<[^>]+>/g, '').trim() : '';
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: plainBody,
    },
    trigger: null,
  });
};
