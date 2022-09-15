import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {login, wrongUsernameAndOrPassword} from '../../services/authService';
import {Alert} from 'react-native';

interface LoginScreenControllerReturnType {
  username: string;
  password: string;
  setUsername: Function;
  setPassword: Function;
  fillWithTestUser: Function;
  signIn: Function;
}
const TEST_USERNAME: string = 'test@test.com';
const TEST_PASSWORD: string = 'test123-Test';
const HOME_SCREEN: string = 'Home';

function LoginScreenController(): LoginScreenControllerReturnType {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();
  async function signIn(): Promise<void> {
    try {
      const user = await login(username, password);
      if (!user.id) {
        throw wrongUsernameAndOrPassword;
      }
      if (user.id) {
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Wrong username and/or password. Try again');
    }
  }

  function fillWithTestUser(): void {
    setPassword(TEST_PASSWORD);
    setUsername(TEST_USERNAME);
  }
  return {
    username,
    password,
    setUsername,
    setPassword,
    fillWithTestUser,
    signIn,
  };
}

export default LoginScreenController;
