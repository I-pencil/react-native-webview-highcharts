const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const resolve = (file) => {
  return path.resolve(__dirname, file)
}

// const build = spawn('./node_modules/.bin/webpack --config ./webpack.config.js');

if (fs.existsSync(resolve('./dist'))) {
  fs.rmdirSync(resolve('./dist'));
};

if (fs.existsSync(resolve('./public/dist'))) {
  fs.rmdirSync(resolve('./public/dist'));
}
const build = spawn('npm', ['run', 'build']);
build.stdout.on('data', (data) => {
  // console.log('stdout: ', data);
})

build.stderr.on('data', (data) => {
  console.log('stderr: ', data);
})

build.on('close', (code) => {

  if (code != 0) return;
  console.log('build successfully');

  const templatePath = resolve('./index.html');

  if (!fs.existsSync(templatePath)) return

  if (!fs.existsSync(resolve('./dist/main.js'))) return

  fs.copyFileSync(templatePath, resolve('./public/dist/index.html'));
  console.log('copy successfully');

  const js = fs.readFileSync(resolve('./dist/main.js'), {encoding: 'utf8'});

  fs.appendFileSync(
    resolve('./public/dist/index.html'),
    `${js}\n</script>\n</body>\n</html>`,
    {
      encoding: 'utf8',
    }
  );
})
