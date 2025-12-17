import {Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false; // Replace with actual auth check
  
  // Redirect to the appropriate screen based on auth state
  return isLoggedIn ? <Redirect href="/" /> : <Redirect href="/(auth)/login" />;
}