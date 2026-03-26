const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // 读取输入参数
    const version = core.getInput('version');
    const arch = core.getInput('arch');
    const os = core.getInput('os').toLowerCase();
    const components = core.getInput('components');

    core.info(`Installing LLVM ${version} for ${os}-${arch}...`);

    // 构建下载 URL
    let downloadUrl = '';
    let extractDir = '';
    let executableExt = '';

    if (os === 'linux') {
      downloadUrl = `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/LLVM-${version}-Linux-X64.tar.xz`;
      extractDir = `LLVM-${version}-Linux-X64`;
    } else if (os === 'macos') {
      // macOS 使用 Homebrew 安装
    } else if (os === 'windows') {
      downloadUrl = `https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/LLVM-${version}-win64.exe`;
      executableExt = '.exe';
    } else {
      throw new Error(`Unsupported operating system: ${os}`);
    }

    // 安装 LLVM
    if (os === 'macos') {
      // macOS 使用 Homebrew 安装
      // macOS 下 version 格式化为大版本号
      const version = version.split('.')[0];

      core.info('Installing LLVM on macOS using Homebrew...');
      await exec.exec('brew', ['install', `llvm@${version}`]);
      
      // 设置环境变量
      const llvmPath = await exec.getExecOutput('brew', ['--prefix', `llvm@${version}`]);
      const llvmHome = llvmPath.stdout.trim();
      const binPath = path.join(llvmHome, 'bin');
      core.addPath(binPath);
      core.exportVariable('LLVM_HOME', llvmHome);
    } else {
      // 下载 LLVM
      core.info(`Downloading LLVM from ${downloadUrl}...`);
      let downloadPath;
      if (os === 'windows') {
        downloadPath = path.join(process.env.RUNNER_TEMP, `llvm${executableExt}`);
      } else {
        downloadPath = path.join(process.env.RUNNER_TEMP, `llvm.tar.xz`);
      }
      await exec.exec('curl', ['-L', '-o', downloadPath, downloadUrl]);

      // 安装 LLVM
      if (os === 'windows') {
        // Windows 安装
        core.info('Installing LLVM on Windows...');
        await exec.exec(downloadPath, ['/S']);
      } else {
        // Linux 安装
        core.info('Extracting LLVM...');
        const extractPath = path.join(process.env.RUNNER_TEMP, extractDir);
        await exec.exec('tar', ['-xJf', downloadPath, '-C', process.env.RUNNER_TEMP]);

        // 设置环境变量
        const binPath = path.join(extractPath, 'bin');
        core.addPath(binPath);
        core.exportVariable('LLVM_HOME', extractPath);
      }
    }

    // 验证安装
    core.info('Verifying LLVM installation...');
    await exec.exec('clang', ['--version']);
    
    // 只在非 Windows 平台上运行 llvm-config
    if (os !== 'windows') {
      await exec.exec('llvm-config', ['--version']);
    }

    core.info(`LLVM ${version} installed successfully!`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
