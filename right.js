const playwright = require("playwright");

// CHANGE THE URL
const url =
  "https://www.binance.com/en/support/announcement/new-cryptocurrency-listing?c=48&navId=48";

// CHANGE OR UPDATE USER INPUT
const userInput = ["Will List", "on Binance Launchpool!"];

function getCurrentDateTime() {
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return [date, month, year, hours, minutes, seconds];
}

async function test() {
  const browser = await playwright.chromium.launch({ headless: false }); // if true, browser will run in background
  const page = await browser.newPage();

  while (true) {
    const [dd, mm, yy, h, m, s] = getCurrentDateTime();

    await page.goto(url);

    const elementTexts = await page.$$eval("div.css-1yxx6id", (els) =>
      els.map((el) => el.textContent)
    );

    // Remove half of the index cus idk why :/
    const halfLength = Math.ceil(elementTexts.length / 2);
    elementTexts.splice(-halfLength);

    // Periksa apakah ada kalimat yang sesuai dengan input pengguna
    const matchingSentences = elementTexts.map((text) => {
      const matchedInputs = userInput.filter((input) => text.includes(input));
      return { text, matchedInputs };
    });

    // Filter and log the objects with non-empty matchedInputs
    const nonEmptyMatches = matchingSentences.filter(
      (obj) => obj.matchedInputs.length > 0
    );

    // Clear the console
    console.clear();

    if (nonEmptyMatches.length > 0) {
      console.log(
        `${dd}/${mm}/${yy} ${h}:${m}:${s} | ${nonEmptyMatches.length} Data found:\n`
      );
      nonEmptyMatches.map((data) =>
        console.log(
          `    [ "${data.matchedInputs}" ]
    ${data.text}
          `
        )
      );
    } else {
      console.log(
        `\n ${date} ${hours}:${minutes}:${seconds} | Data tidak ditemukan`
      );
    }

    // Wait before page got reloaded
    await page.waitForTimeout(10000);
  }
}

test();
