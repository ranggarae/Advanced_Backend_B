const conn = require("./config");
const data = require("./dataListContinue.json"); // ← ini file JSON kamu

async function runSeed() {
  try {
    await conn.promise().query("DELETE FROM list_continue");

    for (const item of data) {
      const { title, image, image1, progress, metadata } = item;
      await conn.promise().query(
        "INSERT INTO list_continue (title, image, image1, progress, metadata) VALUES (?, ?, ?, ?, ?)",
        [title, image, image1, progress, JSON.stringify(metadata)]
      );
    }

    console.log("✅ Seeding list_continue berhasil.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding gagal:", err);
    process.exit(1);
  }
}

runSeed();
