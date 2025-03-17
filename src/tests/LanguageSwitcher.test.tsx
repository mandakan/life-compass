import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import i18next from "i18next";

describe("LanguageSwitcher Component", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset i18next language to default 'en' before each test.
    i18next.changeLanguage("en");
  });

  it("renders without errors and shows the initially selected language", () => {
    render(<LanguageSwitcher />);
    // The initial button label should reflect the language from localStorage or i18next default.
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    // Since no localStorage is set, it falls back to i18next.language which is 'en'
    expect(button.textContent).toMatch(/english/i);
  });

  it("opens dropdown and displays all language options", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const optionEnglish = await screen.findByRole("option", { name: /english/i });
    const optionSwedish = await screen.findByRole("option", { name: /svenska/i });
    const optionDutch = await screen.findByRole("option", { name: /nederlands/i });
    const optionGerman = await screen.findByRole("option", { name: /deutsch/i });
    const optionDanish = await screen.findByRole("option", { name: /dansk/i });
    const optionNorwegian = await screen.findByRole("option", { name: /norsk bokmål/i });

    expect(optionEnglish).toBeInTheDocument();
    expect(optionSwedish).toBeInTheDocument();
    expect(optionDutch).toBeInTheDocument();
    expect(optionGerman).toBeInTheDocument();
    expect(optionDanish).toBeInTheDocument();
    expect(optionNorwegian).toBeInTheDocument();
  });

  it("changes language when a different option is selected", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const optionSwedish = await screen.findByRole("option", { name: /svenska/i });
    fireEvent.click(optionSwedish);

    await waitFor(() => {
      expect(i18next.language).toBe("sv");
    });
    // Check that the button label updates to Svenska
    expect(screen.getByRole("button").textContent).toMatch(/svenska/i);
    // Check that the language is stored in localStorage
    expect(localStorage.getItem("selectedLanguage")).toBe("sv");
  });

  it("handles keyboard selection for language options", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const options = await screen.findAllByRole("option");
    // Simulate pressing 'Enter' on the second option (Svenska)
    fireEvent.keyDown(options[1], { key: "Enter", code: "Enter" });
    await waitFor(() => {
      expect(i18next.language).toBe("sv");
    });
    expect(localStorage.getItem("selectedLanguage")).toBe("sv");
  });

  it("closes the dropdown when clicking outside", async () => {
    const { container } = render(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    
    // Simulate a click outside the component by firing a mousedown event on the document.
    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });
});
