import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar = () => {
  return (
    <header className="w-full p-3 pt-6">
      <nav className="bg-background z-50 mx-auto flex w-full items-center justify-between gap-2 rounded-full p-2 px-4 text-base font-normal">
        <a href="/">
          <img
            src="/jira.svg"
            alt="Jira Logo"
            width={50}
            height={50}
            className="transition-all duration-300 active:scale-95 dark:invert-100"
          />
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
};
