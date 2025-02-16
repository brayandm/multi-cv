
import { useState } from "react";
import WelcomeScene from "@/scenes/WelcomeScene";
import HomeScene from "@/scenes/HomeScene";

export default function App() {
  const [logged,] = useState(false);
  return (
    <div>
      {
        logged ?
          <HomeScene />
          : <WelcomeScene />
      }
    </div>
  );
}
