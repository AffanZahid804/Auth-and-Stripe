import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GoogleAuthService } from '../../services/google-auth.service';
import { AuthResponse } from '../../types/auth.types';

interface Props {
  onSuccess: (response: AuthResponse) => void;
  onError: (error: Error) => void;
}

export const GoogleSignInButton: React.FC<Props> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const googleAuth = GoogleAuthService.getInstance();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await googleAuth.signIn();
      onSuccess(response);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Sign in with Google</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
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