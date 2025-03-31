
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';

const mockUsers = [
  { username: 'user1', password: 'password1', name: 'John Doe' },
  { username: 'user2', password: 'password2', name: 'Jane Smith' },
];

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    // Simulate API call delay
    setTimeout(() => {
      const user = mockUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        dispatch(loginSuccess({ username: user.username, name: user.name }));
      } else {
        dispatch(loginFailure('Invalid username or password'));
      }
    }, 800);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to TodoMaster</CardTitle>
          <CardDescription className="text-center">
            Login to manage your tasks efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            Demo accounts: user1/password1 or user2/password2
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
