"use client";

import ConfigGenerator from "@/components/ConfigGenerator";
import HeaderWithHeight from "@/components/HeaderWithHeight";
import PageHeightObserver from "@/components/PageHeightObserver";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PageHeightObserver />
      <div className="container mx-auto px-4 py-8">
        <HeaderWithHeight />
        <main className="max-w-4xl mx-auto">
          <ConfigGenerator />
        </main>
      </div>
    </div>
  );
}
