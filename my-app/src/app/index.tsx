import { Redirect } from 'expo-router';

/** The home screen lives in the tab group at /home. */
export default function Index() {
  return <Redirect href="/home" />;
}

