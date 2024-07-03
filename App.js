import AppNavigation from './navigation/appNavigation';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <AppNavigation />
  );
}


