import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GoogleSignInButton } from './GoogleSignInButton';
import { LinkedInSignInButton } from './LinkedInSignInButton';
import { AppleSignInButton } from './AppleSignInButton';
import { AuthResponse } from '../../types/auth.types';

interface Props {
  onSuccess: (response: AuthResponse) => void;
  onError: (error: Error) => void;
}

export const SocialSignIn: React.FC<Props> = ({ onSuccess, onError }) => {
  return (
    <View style={styles.container}>
      <GoogleSignInButton onSuccess={onSuccess} onError={onError} />
      <LinkedInSignInButton onSuccess={onSuccess} onError={onError} />
      <AppleSignInButton onSuccess={onSuccess} onError={onError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
}); 