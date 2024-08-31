import React from "react";
import { screen } from "@testing-library/react";
import renderWithReactIntl from "@library/jest/ReactIntlWrapper";

import ForgotPassword from "@modules/admin/auth/components/ForgotPassword";

describe("This suit is to test the ForgotPassword component", () => {
    it("renders without crashing", () => {
        renderWithReactIntl(<ForgotPassword />);
    });

    it("renders a email input with placeholder.", () => {
        renderWithReactIntl(<ForgotPassword />);

        expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute("placeholder", "Email");
    });
});
