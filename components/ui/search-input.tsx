import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchInput({
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  return (
    <label className="flex min-w-60 items-center gap-2 rounded-xl border border-(--border) bg-white px-3 py-2 text-sm text-slate-500">
      <Search className="h-4 w-4" />
      <input
        className="w-full border-none bg-transparent outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        type="search"
        {...props}
      />
    </label>
  );
}
