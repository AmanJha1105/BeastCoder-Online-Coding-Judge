const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
console.log("this is outputpath",outputPath);

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async(filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const execFile = `${jobId}.exe`;
  const outPath = path.join(outputPath, execFile);
  console.log(outPath);
   return new Promise((resolve, reject) => {
   exec(
      `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\"${execFile}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr});
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
