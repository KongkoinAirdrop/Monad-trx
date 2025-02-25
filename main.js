const prompts = require("prompts");
const displayHeader = require("./src/banner.js");
const { spawn } = require("child_process");

async function loadChalk() {
  return (await import("chalk")).default;
}


(async () => {
  const chalk = await loadChalk();

  console.clear();
  displayHeader();
  console.log(chalk.blueBright.bold("\n🚀 Jalankan Modul Auto\n"));

  const scripts = [
    { name: "Uniswap", path: "./modul/uniswap.js" },
    { name: "Deploy Kontrak", path: "./modul/deploy.js" },
    { name: "Rubic Swap", path: "./modul/rubic.js" },
    { name: "Bean Swap", path: "./modul/bean.js" },
    { name: "Magma Staking", path: "./modul/magma.js" },
    { name: "Izumi Swap", path: "./modul/izumi.js" },
    { name: "aPriori Staking", path: "./modul/apriori.js" },
    { name: "Bebob Swap", path: "./modul/bebop.js" },
    { name: "Monorail", path: "./modul/mono.js" },
    { name: "Kitsu", path: "./modul/kitsu.js" },
    { name: "AutoSend", path: "./modul/AutoSend.js" },
  ];

  console.log(chalk.yellow("🔹 Daftar Modul Tersedia 🔹\n"));
  scripts.forEach((script, index) => {
    console.log(chalk.green(`  [${index + 1}] ${script.name}`));
  });
  console.log("");

  async function runScript(script) {
    console.log(chalk.yellow(`\n📜 Menjalankan: ${script.name}...`));

    return new Promise((resolve, reject) => {
      const process = spawn("node", [script.path]);

      process.stdout.on("data", (data) => console.log(chalk.white(data.toString())));
      process.stderr.on("data", (data) => console.error(chalk.red(`Error: ${data.toString()}`)));

      process.on("close", (code) => {
        if (code === 0) {
          console.log(chalk.green(`✅ Berhasil: ${script.name}`));
          resolve();
        } else {
          console.error(chalk.red(`❌ Gagal: ${script.name} (Kode keluar: ${code})`));
          reject(new Error(`Modul ${script.name} gagal`));
        }
      });
    });
  }

  async function runScriptsSequentially(loopCount, selectedScripts) {
    for (let i = 0; i < loopCount; i++) {
      console.log(chalk.blueBright(`\n🔄 Loop ${i + 1} dari ${loopCount}...\n`));
      for (const script of selectedScripts) {
        try {
          await runScript(script);
        } catch (error) {
          console.error(chalk.red(`⚠️ Melewati ${script.name} karena error`));
        }
      }
    }
  }

  async function main() {
    const { selectedModules } = await prompts({
      type: "multiselect",
      name: "selectedModules",
      message: "Pilih modul yang ingin dijalankan (gunakan spasi untuk memilih):",
      instructions: `
      Instruksi:
      - Gunakan panah atas/bawah (↑/↓) untuk memilih
      - Tekan spasi (␣) untuk memilih atau menghapus pilihan
      - Tekan "a" untuk memilih semua
      - Tekan Enter untuk melanjutkan`,
      choices: scripts.map(script => ({
        title: script.name,
        value: script,
        selected: true
      })),
      min: 1
    });

    const { loopCount } = await prompts({
      type: "number",
      name: "loopCount",
      message: "Berapa kali ingin menjalankan modul?",
      validate: (value) => (value > 0 ? true : "Masukkan angka lebih dari 0"),
      initial: 1
    });

    console.log(chalk.green(`\n🚀 Memulai eksekusi ${selectedModules.length} modul selama ${loopCount} loop\n`));

    await runScriptsSequentially(loopCount, selectedModules);

    console.log(chalk.green.bold("\n✅✅ Semua modul selesai dijalankan! ✅✅\n"));
  }

  main();
})();
