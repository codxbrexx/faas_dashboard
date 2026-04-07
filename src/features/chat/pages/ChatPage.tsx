import { ChatInterface } from '@/features/chat/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="grow flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-[420px] h-[700px] bg-white shadow-2xl shadow-blue-900/10 rounded-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-500">
        <ChatInterface />
      </div>
    </div>
  );
}
