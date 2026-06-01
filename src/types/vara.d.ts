declare module "vara" {
  interface TextItem {
    text: string;
    fontSize?: number;
    strokeWidth?: number;
    color?: string;
    textAlign?: "left" | "center" | "right";
    autoAnimation?: boolean;
    queued?: boolean;
    delay?: number;
    duration?: number;
    letterSpacing?: number | Record<string, number>;
    x?: number;
    y?: number;
    fromCurrentPosition?: { x?: boolean; y?: boolean };
    id?: string;
  }

  interface VaraOptions {
    fontSize?: number;
    strokeWidth?: number;
    color?: string;
    textAlign?: "left" | "center" | "right";
    autoAnimation?: boolean;
    queued?: boolean;
    delay?: number;
    duration?: number;
    letterSpacing?: number | Record<string, number>;
  }

  class Vara {
    constructor(
      element: string | Element,
      fontSource: string,
      text: TextItem[],
      options?: VaraOptions
    );
    ready(callback: () => void): void;
    animationEnd(callback: (i: number, obj: object) => void): void;
    playAll(): void;
    get(id: string): object;
  }

  export default Vara;
}
