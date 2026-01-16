import { ArrowUp, Square } from 'lucide-react';

import { useChatForm } from '@/features/chat/hooks/use-chat-form';
import { PROMPT_SUGGESTIONS } from '@/features/chat/lib/constant';
import { useChatStore } from '@/features/chat/store/store';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/features/chat/ui/prompt-input';
import { PromptSuggestion } from '@/features/chat/ui/prompt-suggestion';
import { Button } from '@/ui/button';

export function Input() {
  const input = useChatStore((s) => s.input);
  const setInput = useChatStore((s) => s.setInput);
  const { handleSubmit, isPending } = useChatForm();

  return (
    <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-3 py-3 md:px-5 md:py-5">
      <PromptInput
        value={input}
        onValueChange={setInput}
        isLoading={isPending}
        onSubmit={handleSubmit}
        maxHeight={150}
        className="bg-popover border-input relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
      >
        <PromptInputTextarea
          className="min-h-11 overflow-y-auto pt-3 pl-4 text-base leading-[1.3]"
          placeholder="Ask me anything..."
        />

        <PromptInputActions className="mt-5 flex w-full justify-end gap-2 px-3 pb-3">
          <PromptInputAction
            tooltip={isPending ? 'Stop generation' : 'Send message'}
          >
            <Button
              size="sm"
              className="h-9 w-9 rounded-full"
              onClick={handleSubmit}
              disabled={!input.trim() || isPending}
            >
              {isPending ? (
                <Square className="size-3 fill-current" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 justify-center whitespace-nowrap">
          {PROMPT_SUGGESTIONS.map((suggestion) => (
            <PromptSuggestion
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="shrink-0 capitalize"
            >
              {suggestion}
            </PromptSuggestion>
          ))}
        </div>
      </div>
    </div>
  );
}
