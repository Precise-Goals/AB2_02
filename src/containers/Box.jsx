import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";


export default function Home() {
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (!hasClicked) {
      const elm = document.getElementById("hw");
      if (elm) {
        elm.click();
        setHasClicked(true);
      }
    }
  }, [hasClicked]);
  return (
    <main>
      <Spline
        id="hw"
        style={{
          height: "90vh",
          width: "100vw",
          position: "absolute",
          zIndex: " 0",
        }}
        scene="https://prod.spline.design/B4n0FQraKkboEuTf/scene.splinecode"
      />
    </main>
  );
}
