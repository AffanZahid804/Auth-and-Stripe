import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { AppleAuthService } from '../../services/apple-auth.service';
import { AuthResponse } from '../../types/auth.types';

interface Props {
  onSuccess: (response: AuthResponse) => void;
  onError: (error: Error) => void;
}

export const AppleSignInButton: React.FC<Props> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const appleAuth = AppleAuthService.getInstance();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await appleAuth.signIn();
      onSuccess(response);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show Apple Sign-In on iOS devices
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Sign in with Apple</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 