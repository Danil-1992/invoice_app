import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";
const Handlebars = require("handlebars");

// Регистрируем хелпер для форматирования даты
Handlebars.registerHelper("formatDate", (dateString: string) => {
  if (!dateString) return "Н/Д";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

export async function generateInvoicePDF(data: any): Promise<Buffer> {
  let browser = null;

  try {
    console.log("📄 Начинаем генерацию PDF для инвойса:", data.invoice.id);

    // 1. Загружаем HTML шаблон
    const templatePath = path.join(
      __dirname,
      "../templates/invoice-template.html"
    );
    const htmlTemplate = await fs.readFile(templatePath, "utf-8");

    // 2. Компилируем Handlebars шаблон
    const template = Handlebars.compile(htmlTemplate);
    const html = template(data);

    // 3. Запускаем браузер и генерируем PDF
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      executablePath: "/usr/bin/chromium-browser", // ← путь к Chromium
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 4. Генерируем PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    console.log("✅ PDF сгенерирован, размер:", pdfBuffer.length, "bytes");
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ Ошибка генерации PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
