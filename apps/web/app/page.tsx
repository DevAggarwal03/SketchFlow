import { Button } from "@/ui/button";
import FeatureCard from "@/components/FeatureCard";
import { Header } from "@/components/Header";
import { PenToolIcon, ShareIcon, UsersIcon } from "@/components/icons";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">
              Collaborate and Create, Instantly.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
              SketchFlow is a minimalist, real-time collaborative whiteboard.
              Perfect for brainstorming, planning, and bringing your ideas to life with your team.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="primary" className="px-8 py-4 text-lg">
                Start Drawing for Free
              </Button>
            </div>
          </div>
        </section>

        {/* Product Visual Section */}
        <section className="pb-20 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="relative mx-auto max-w-5xl h-[300px] md:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* This is a mock UI to represent the application */}
              <div className="absolute top-0 left-0 h-12 w-full bg-gray-100 border-b border-gray-200 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="p-16">
                 {/* Mock content inside the canvas */}
                 <div className="absolute top-20 left-24 w-40 h-24 bg-blue-200 border-2 border-blue-400 rounded-lg transform -rotate-3"></div>
                 <div className="absolute top-40 right-32 w-32 h-32 bg-yellow-200 border-2 border-yellow-400 rounded-full"></div>
                 <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-gray-400 font-medium text-2xl">Your next big idea starts here.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need to Collaborate</h2>
              <p className="mt-4 text-lg text-gray-600">Simple tools, powerful results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<PenToolIcon className="w-7 h-7" />}
                title="Intuitive Drawing Tools"
                description="Effortlessly sketch, write, and diagram with a clean and simple set of tools. No distractions, just pure creativity."
              />
              <FeatureCard
                icon={<UsersIcon className="w-7 h-7" />}
                title="Real-Time Collaboration"
                description="Invite your team and see their cursors move in real-time. Brainstorm together as if you were in the same room."
              />
              <FeatureCard
                icon={<ShareIcon className="w-7 h-7" />}
                title="Easy Sharing"
                description="Share your canvas with a single link. Export your creations as high-quality images to use anywhere."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SketchFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
