import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID = '855199677097-thsa5blah3fdk2qrcd3u0hk6qqp0qhdd.apps.googleusercontent.com';
const WEB_CLIENT_ID = '855199677097-kv9jbe4pge5qihk3a0arsp4b439sjgpf.apps.googleusercontent.com';

export function useGoogleAuth(onSuccess: (token: string) => void) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    console.log('[useGoogleAuth] Raw auth response:', response);
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      console.log('[useGoogleAuth] Extracted accessToken:', token);
      if (token) onSuccess(token);
    }
  }, [response]);

  return { request, promptAsync };
}
