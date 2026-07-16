/**
 * ArenaMind Dashboard — Component & Accessibility Tests
 *
 * Validates the authentication boundary, accessibility semantics,
 * axe-core automated scanning, and component extraction integrity.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { Providers } from "./providers";
import { OperationsDashboard } from "./dashboard";

describe("OperationsDashboard", () => {
  it("presents an accessible authentication boundary when no session exists", () => {
    render(<Providers><OperationsDashboard /></Providers>);
    expect(screen.getByRole("heading", { name: "Command sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "username");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /enter command center/i })).toBeEnabled();
  });

  it("has no serious accessibility violations on the sign-in boundary", async () => {
    render(<Providers><OperationsDashboard /></Providers>);
    // JSDOM cannot compute real CSS color contrast; browser E2E owns that rule.
    const results = await axe.run(document.body, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact ?? ""))).toHaveLength(0);
  });

  it("renders the stadium operations branding on the login screen", () => {
    render(<Providers><OperationsDashboard /></Providers>);
    expect(screen.getByText("ArenaMind")).toBeInTheDocument();
    expect(screen.getByText("Secure operations access")).toBeInTheDocument();
    expect(screen.getByText("STADIUM OPERATIONS CENTER")).toBeInTheDocument();
  });

  it("displays operational accountability notice on the login screen", () => {
    render(<Providers><OperationsDashboard /></Providers>);
    expect(
      screen.getByText(/access and actions are recorded/i)
    ).toBeInTheDocument();
  });

  it("allows autofilling the deployed demo credentials on the login screen", () => {
    render(<Providers><OperationsDashboard /></Providers>);
    const autofillBtn = screen.getByRole("button", { name: /autofill/i });
    expect(autofillBtn).toBeInTheDocument();
    
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveValue("");
    
    fireEvent.click(autofillBtn);
    expect(emailInput).toHaveValue("administrator@arenamind.local");
    expect(passwordInput).toHaveValue("MxgUGVqZuB5rG8kqrGA-Zg");
  });
});
