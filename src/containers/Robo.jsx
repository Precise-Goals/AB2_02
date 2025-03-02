import Spline from "@splinetool/react-spline";

export default function Robo() {
  return (
    <main>
      <Spline
        style={{
          height: "90vh",
          width: "100vw",
          position: "absolute",
          zIndex: "1",
        }}
        scene="https://prod.spline.design/QgGURaP7MecM2KLv/scene.splinecode"
      />
    </main>
  );
}
