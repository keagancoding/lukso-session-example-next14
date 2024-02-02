declare global {
  interface Window {
    ethereum: any;
    lukso: any;
  }
}

type LSP3ProfileT = {
  key: string;
  name: string;
  value: {
    LSP3Profile: {
      name: string;
      description: string;
      links: never[];
      tags: string[];
      profileImage: {
        width: number;
        height: number;
        verification: {
          method: string;
          data: string;
        };
        url: string;
      }[];
      backgroundImage: {
        width: number;
        height: number;
        verification: {
          method: string;
          data: string;
        };
        url: string;
      }[];
    };
  };
};
