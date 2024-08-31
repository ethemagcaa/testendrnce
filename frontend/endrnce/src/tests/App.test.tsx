import React from "react";
import renderWithReactIntl from "@library/jest/ReactIntlWrapper";

import App from "@/App";

test("renders without crashing", () => {
    renderWithReactIntl(<App/>);
});
