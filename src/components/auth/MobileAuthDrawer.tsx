
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';

interface MobileAuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const MobileAuthDrawer = ({
  isOpen,
  onClose,
  children,
  title,
}: MobileAuthDrawerProps) => {
  const navigate = useNavigate();

  // Prevent body scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] pt-4 px-0 rounded-t-xl overflow-hidden">
        <DrawerHeader className="py-2 px-4 flex justify-between items-center">
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {children}
        </div>
        <DrawerFooter className="pt-2 pb-8 px-4">
          <Button 
            onClick={() => {
              onClose();
              navigate('/');
            }} 
            variant="outline" 
            className="w-full"
          >
            Артка кайтуу
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileAuthDrawer;
