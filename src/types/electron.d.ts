declare global {
  interface Window {
    electronAPI: {
      getPath: (name: string) => string;
      getDatabasePath: () => string;
    };
  }
}

export {}; 