import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./layout";
import { Provider } from "./provider/provider";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <Layout />
  </Provider>,
);
