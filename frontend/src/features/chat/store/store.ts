import { create } from 'zustand';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface ChatState {
  messages: Message[];
  input: string;

  setInput: (value: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  appendToken: (text: string) => void;
  deleteIncompleteResponse: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: '',

  setInput: (input) => set({ input }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: crypto.randomUUID() }],
    })),

  appendToken: (text) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];

      if (!last || last.role !== 'assistant') return state;

      messages[messages.length - 1] = {
        ...last,
        content: last.content + text,
      };

      return { messages };
    }),

  deleteIncompleteResponse: () =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        return { messages: state.messages.slice(0, -1) };
      }
      return {};
    }),
}));
