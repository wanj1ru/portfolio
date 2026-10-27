import { expect, test, type Page } from "@playwright/test";
import { building, chapters, site } from "../content/site";
import { experience, education, resumes, tools } from "../content/profile";
import { projects } from "../content/projects";

// Skip the boot intro everywhere except the test that checks it.
async function open(page: Page, hash = "") {
  await page.addInitScript(() => sessionStorage.setItem("booted", "1"));
  await page.goto(`/${hash}`);
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1000) < 600;

test.describe("page health", () => {
  test("loads with no script errors and no sideways scroll", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await open(page);
    await expect(page).toHaveTitle(/Esther Kung'u/);
    await expect(page.locator("h1")).toContainText(site.last);
    for (const id of ["story", "work", "team", "building", "toolbox", "experience", "resumes", "play", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test("every in-page link points at a section that exists", async ({ page }) => {
    await open(page);
    const targets = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const t of new Set(targets)) {
      await expect(page.locator(t), `missing target ${t}`).toHaveCount(1);
    }
  });

  test("boot intro plays on first visit and can be skipped", async ({ page }) => {
    await page.goto("/");
    const intro = page.locator(".intro");
    await expect(intro).not.toHaveClass(/done/);
    await intro.click();
    await expect(intro).toHaveClass(/done/);
  });
});

test.describe("hero", () => {
  test("the cable plugs in and the link comes up", async ({ page }) => {
    await open(page);
    const plug = page.getByRole("button", { name: "Plug it in" });
    if (await plug.isVisible()) await plug.click();
    await expect(page.locator(".link-state.up")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(".link-state")).toContainText("link up");
  });

  test("on phones the 3D rack is on the first screen", async ({ page }) => {
    test.skip(!isMobile(page), "phone layout only");
    await open(page);
    const box = await page.locator(".rack-stage").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThan(page.viewportSize()!.height * 0.5);
  });
});

test.describe("fleet story", () => {
  test("each chapter drives the 3D scene's status line", async ({ page }) => {
    await open(page);
    const chaptersEl = page.locator(".chapter");
    await expect(chaptersEl).toHaveCount(chapters.length);
    for (let i = 0; i < chapters.length; i++) {
      await chaptersEl.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
      await expect(page.locator(".stage-hud")).toContainText(chapters[i].hud[0]);
    }
  });
});

test.describe("work", () => {
  test("every project is listed and slides out when clicked", async ({ page }) => {
    await open(page, "#work");
    const plates = page.locator(".plate");
    await expect(plates).toHaveCount(projects.length);
    for (let i = 0; i < projects.length; i++) {
      const plate = plates.nth(i);
      await expect(plate).toContainText(projects[i].title, { ignoreCase: true });
      await plate.click();
      await expect(plate).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator(`#drawer-${i}`)).toContainText(projects[i].did[0]);
    }
  });

  test("no project claims to have led anything", async () => {
    for (const p of projects) for (const line of [p.summary, p.result, ...p.did]) expect(line).not.toMatch(/\bled\b|\blead\b/i);
  });
});

test.describe("NiaTalent", () => {
  test("the sample simulation scores", async ({ page }) => {
    await open(page, "#building");
    await expect(page.getByRole("link", { name: /niatalent\.com/ })).toHaveAttribute("href", building.url);
    await page.getByRole("button", { name: "Run a sample simulation" }).click();
    await expect(page.locator(".sheet .stamp")).toHaveText("Scored");
    await expect(page.locator(".sheet")).toContainText(String(building.sample.scores[0][1]));
  });
});

test.describe("patch panel", () => {
  test("plugging a port shows where the tool was used", async ({ page }) => {
    await open(page, "#toolbox");
    const panels = page.locator(".panel");
    await expect(panels).toHaveCount(tools.length);
    const bucket = tools[1];
    const [name, where] = Object.entries(bucket.items)[3];
    const panel = panels.nth(1);
    await panel.getByRole("button", { name }).click();
    await expect(panel.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
    await expect(panel.locator(".lcd")).toContainText(where);
  });
});

test.describe("experience and education", () => {
  test("work log and education are listed separately", async ({ page }) => {
    await open(page, "#experience");
    const log = page.locator(".log:not(.edu) li");
    await expect(log).toHaveCount(experience.length);
    const edu = page.locator(".log.edu li");
    await expect(edu).toHaveCount(education.length);
    await expect(page.locator(".log.edu")).toContainText("2019 – 2021");
    await expect(page.locator(".log:not(.edu)")).not.toContainText("Diploma");
  });

  test("certificate stickers flip", async ({ page }) => {
    await open(page, "#experience");
    const card = page.locator(".flip").first();
    await card.click();
    await expect(card).toHaveClass(/on/);
  });
});

test.describe("resumes", () => {
  for (const r of resumes) {
    test(`${r.title} resume downloads as a PDF`, async ({ page, request }) => {
      await open(page, "#resumes");
      const link = page.getByRole("link", { name: "Download PDF" }).nth(resumes.indexOf(r));
      await expect(link).toHaveAttribute("href", `/resumes/${r.file}.pdf`);
      const pdf = await request.get(`/resumes/${r.file}.pdf`);
      expect(pdf.status()).toBe(200);
      expect(pdf.headers()["content-type"]).toContain("application/pdf");
      const thumb = await request.get(`/resumes/${r.file}.png`);
      expect(thumb.status()).toBe(200);
    });
  }
});

test.describe("play", () => {
  test("the shell answers commands", async ({ page }) => {
    await open(page, "#play");
    await page.getByRole("button", { name: "Open shell" }).click();
    const input = page.locator("#shell-in");
    await expect(input).toBeFocused();
    for (const [cmd, expected] of [["whoami", "esther"], ["kubectl get pods", "CrashLoopBackOff"], ["cat about.txt", "Obmondo"], ["nope", "command not found"]]) {
      await input.fill(cmd);
      await input.press("Enter");
      await expect(page.locator(".shell-out")).toContainText(expected);
    }
    await page.getByRole("button", { name: "Close shell" }).click();
    await expect(page.locator(".shell")).toHaveCount(0);
  });

  test("the backtick key opens the shell on desktop", async ({ page }) => {
    test.skip(isMobile(page), "no keyboard shortcut on phones");
    await open(page);
    await page.locator("body").press("`");
    await expect(page.locator(".shell")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".shell")).toHaveCount(0);
  });

  test("the pod game runs and restarting a crashed pod scores", async ({ page }) => {
    await open(page, "#play");
    await page.getByRole("button", { name: "Start the on-call shift" }).click();
    await page.getByRole("button", { name: "Start shift" }).click();
    const bad = page.locator(".pod.bad").first();
    await expect(bad).toBeVisible({ timeout: 20_000 });
    await bad.dispatchEvent("click");
    await expect(page.locator(".game-stats b").nth(2)).not.toHaveText("0");
    await expect(page.locator(".game-stats b").first()).not.toHaveText("60");
    await page.getByRole("button", { name: "Close" }).click();
  });
});

test.describe("contact", () => {
  test("email and profile links are correct", async ({ page }) => {
    await open(page, "#contact");
    await expect(page.locator(".mail")).toHaveText(site.email);
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", site.linkedin);
    await expect(page.locator("#contact").getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", site.github);
  });
});
