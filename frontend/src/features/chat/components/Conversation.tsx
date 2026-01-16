import { useChatStore } from '@/features/chat/store/store';
import {
  ChatContainerContent,
  ChatContainerRoot,
} from '@/features/chat/ui/chat-container';
import { Message, MessageContent } from '@/features/chat/ui/message';
import { cn } from '@/lib/utils';

function Conversation() {
  const messages = useChatStore((s) => s.messages);

  return (
    <ChatContainerRoot className="relative w-full flex-1 space-y-0 overflow-y-auto">
      <ChatContainerContent className="mx-auto w-full space-y-12 px-4">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          return (
            <Message
              key={message.id}
              className={cn(
                'mx-auto flex w-full flex-col gap-2',
                isAssistant ? 'items-start' : 'items-end',
              )}
            >
              {isAssistant ? (
                <div className="group flex w-full flex-col gap-0">
                  <MessageContent
                    className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0"
                    markdown
                  >
                    {message.content}
                  </MessageContent>
                </div>
              ) : (
                <div className="group flex flex-col items-end gap-1">
                  <MessageContent className="bg-primary text-background max-w-xl rounded-3xl px-5 py-2.5">
                    {message.content}
                  </MessageContent>
                </div>
              )}
            </Message>
          );
        })}
      </ChatContainerContent>
    </ChatContainerRoot>
  );
}

export { Conversation };
