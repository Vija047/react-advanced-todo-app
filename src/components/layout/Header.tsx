
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/store/slices/authSlice';
import { LogOut, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-primary">TodoMaster</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden sm:inline-block">
          Hello, {user?.name || 'User'}
        </span>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline-block">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
