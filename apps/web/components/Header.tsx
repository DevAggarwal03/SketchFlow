
import { Button } from "../ui/button";
import AuthBtns from "./AuthBtns";
import { PenToolIcon } from "./icons";

export function Header() {
    return <header className="absolute top-0 left-0 right-0 z-10 bg-transparent py-4 px-4 sm:px-6 lg:px-8">
    <nav className="container mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <PenToolIcon className="w-8 h-8 text-blue-600" />
        <span className="ml-2 text-2xl font-bold text-gray-800">SketchFlow</span>
      </div>
      <div className="flex items-center space-x-4">
        <AuthBtns/>
      </div>
    </nav>
  </header>
};