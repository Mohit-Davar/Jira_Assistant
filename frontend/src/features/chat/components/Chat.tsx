import { Conversation } from '@/features/chat/components/Conversation';
import { Input } from '@/features/chat/components/Input';
import { Navbar } from '@/features/chat/components/Navbar';

export function Chat() {
  return (
    <main className="bg-secondary h-screen w-screen">
      <div className='max-w-7xl flex flex-col items-center mx-auto h-full'>
      <Navbar />
      <Conversation />
      <Input />
      </div>
    </main>
  );
}
