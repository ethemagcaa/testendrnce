import React from "react";
import { act, fireEvent } from "@testing-library/react";
import renderWithReactIntl from "@library/jest/ReactIntlWrapper";

import Login from "@modules/admin/auth/components/Login";

describe("This suit is to test Login component", () => {
    it("renders without crashing", () => {
        renderWithReactIntl(<Login />);
    });

    it("renders a email input with placeholder.",  async () => {
        const { findAllByText, getByLabelText } = renderWithReactIntl(<Login />);

        await act(async () => {
            // Fill in the form fields
            const emailInput = getByLabelText("Email");
            const passwordInput = getByLabelText("Password");
            fireEvent.change(emailInput, { target: { value: "test@example.com" } });
            fireEvent.change(passwordInput, { target: { value: "password123" } });

            // Submit the form
            const submitButton = await findAllByText("Sign in");
            fireEvent.click(submitButton[1]);

            // Wait for the form submission to complete (use waitFor or mock async functions)
            // await waitFor(() => {
            //     // Check if the user is redirected or an error message is displayed as expected
            //     expect(true).toBeTruthy();
            // });
        });
    });
});
