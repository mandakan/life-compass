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

  test("renders without errors and shows the initially selected language", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /english/i });
    expect(document.body.contains(button)).toBe(true);
    expect(button.textContent).toMatch(/english/i);
  });

  test("opens dropdown and displays all language options", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /english/i });
    fireEvent.click(button);

    const optionEnglish = await screen.findByRole("option", { name: /english/i });
    const optionSwedish = await screen.findByRole("option", { name: /svenska/i });
    const optionDutch = await screen.findByRole("option", { name: /nederlands/i });
    const optionGerman = await screen.findByRole("option", { name: /deutsch/i });
    const optionDanish = await screen.findByRole("option", { name: /dansk/i });
    const optionNorwegian = await screen.findByRole("option", { name: /norsk bokmål/i });

    expect(optionEnglish).toBeTruthy();
    expect(optionSwedish).toBeTruthy();
    expect(optionDutch).toBeTruthy();
    expect(optionGerman).toBeTruthy();
    expect(optionDanish).toBeTruthy();
    expect(optionNorwegian).toBeTruthy();
  });

  test("changes language when a different option is selected", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /english/i });
    fireEvent.click(button);
    const optionSwedish = await screen.findByRole("option", { name: /svenska/i });
    fireEvent.click(optionSwedish);

    await waitFor(() => {
      expect(i18next.language).toBe("sv");
    });
    const newButton = screen.getByRole("button", { name: /svenska/i });
    expect(newButton.textContent).toMatch(/svenska/i);
    expect(localStorage.getItem("selectedLanguage")).toBe("sv");
  });

  test("handles keyboard selection for language options", async () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /english/i });
    fireEvent.click(button);
    const options = await screen.findAllByRole("option");
    fireEvent.keyDown(options[1], { key: "Enter", code: "Enter" });
    await waitFor(() => {
      expect(i18next.language).toBe("sv");
    });
    expect(localStorage.getItem("selectedLanguage")).toBe("sv");
  });

  test("closes the dropdown when clicking outside", async () => {
    const { container } = render(<LanguageSwitcher />);
    const buttons = container.querySelectorAll("button");
    const button = buttons[0];
    fireEvent.click(button);
    // Check that the dropdown is open
    expect(screen.getByRole("listbox")).toBeTruthy();

    // Simulate click outside
    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull();
    });
  });
});
