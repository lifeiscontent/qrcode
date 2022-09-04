import React from "react";
import "./App.css";
import { Qrcode, QrcodeModel } from "@lifeiscontent/qrcode-react";

function App() {
  const [renderedAs, setRenderedAs] = React.useState<"rects" | "path">("rects");
  const model = React.useMemo(
    () => QrcodeModel.encodeText("http://example.com", QrcodeModel.Ecc.HIGH),
    []
  );

  return (
    <>
      <h3>Current Renderer: {renderedAs}</h3>
      <Qrcode
        model={model}
        renderedAs={renderedAs}
        border={5}
        backgroundColor="white"
        foregroundColor="black"
      />
      <button
        onClick={() =>
          setRenderedAs((prev) => (prev === "rects" ? "path" : "rects"))
        }
      >
        Toggle Renderer
      </button>
    </>
  );
}

export default App;
