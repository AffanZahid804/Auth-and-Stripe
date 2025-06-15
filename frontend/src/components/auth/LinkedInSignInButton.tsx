import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinkedInAuthService } from '../../services/linkedin-auth.service';
import { AuthResponse } from '../../types/auth.types';

interface Props {
  onSuccess: (response: AuthResponse) => void;
  onError: (error: Error) => void;
}

export const LinkedInSignInButton: React.FC<Props> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const linkedInAuth = LinkedInAuthService.getInstance();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await linkedInAuth.signIn();
      // Note: The actual authentication response will be handled by the deep linking callback
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
        <Text style={styles.buttonText}>Sign in with LinkedIn</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0077B5',
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