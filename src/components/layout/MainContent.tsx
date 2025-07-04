import React from 'react';

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-grow py-12 px-6 md:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {children}
      </div>
    </main>
  );
};

export default MainContent;