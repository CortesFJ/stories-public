import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";


const root_elm = document.getElementById("react-root")
if (root_elm) {

  const componentName = root_elm.getAttribute('name')


  let Page;
  switch (true) {
    case /desk/.test(componentName):
      Page = lazy(() => import("./desktop/pages/desk/desk"));
      break;
    case /metadataUpdater/.test(componentName):
      Page = lazy(() => import("./desktop/pages/metadataUpdater/metadataUpdater"));
      break;
    case /phEditor/.test(componentName):
      Page = lazy(() => import("./desktop/pages/phEditor/phEditor"));
      break;
    case /stories/.test(componentName):
      Page = lazy(() => import("./desktop/pages/stories/stories"));
      break;
    default:
      console.error('not component name specified in template');
  }

  if (root_elm) {
    const Root = ReactDOM.createRoot(root_elm);
    Root.render(
      <React.StrictMode>
        <Suspense>
          <Page />
        </Suspense>
      </React.StrictMode>
    );
  }

}