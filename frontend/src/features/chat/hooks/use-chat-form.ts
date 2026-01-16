import toast from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';

import { postQuery } from '@/features/chat/api/post-query';
import { useChatStore } from '@/features/chat/store/store';

export function useChatForm() {
  const input = useChatStore((s) => s.input);
  const setInput = useChatStore((s) => s.setInput);
  const addMessage = useChatStore((s) => s.addMessage);
  const appendToken = useChatStore((s) => s.appendToken);
  const deleteIncompleteResponse = useChatStore(
    (s) => s.deleteIncompleteResponse,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: postQuery,
    onError: (error) => {
      console.error('Error posting query:', error);
      // toast.error('Sorry, something went wrong. Please try again.');
      deleteIncompleteResponse();
    },
  });

  const handleSubmit = () => {
    if (!input.trim() || isPending) return;

    addMessage({ role: 'user', content: input });

    addMessage({ role: 'assistant', content: '' });

    mutate({
      query: input,
      onData: (chunk) => {
        appendToken(chunk);
      },
      onError: (err) => {
        console.error(err);
        // toast.error('An error occurred while processing your request.');
        deleteIncompleteResponse();
      },
    });

    setInput('');
  };

  return { handleSubmit, isPending };
}
