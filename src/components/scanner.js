import React, {Component} from 'react';
import './scanner.scss';

const electron = window.require('electron');
const path = window.require('path');
const childProcess = window.require('child_process');

// const scanner = 'sonar-scanner';
// const sonarBasePath = './assets/sonar-scanner-2.8/bin/';
const sonarBasePath = './assets/';

const dialog = electron.remote.dialog;
const isWindows = (electron.remote.process.platform === 'win32');
//const scannerFile = isWindows ? 'sonar-scanner.bat' : 'sonar-scanner';
const scannerFile = isWindows ? 'run.bat' : 'run';

// const appPath = electron.remote.app.getAppPath();
const appPath = window.__dirname;
console.log('window.__dirname', window.__dirname);
class Scanner extends Component {
  constructor() {
    super();
    this.state = {
      status: ''
    };
  }
  selectProjectDir() {
    let filePath = document.querySelector('#filePath');
    let openDirectory;
    dialog.showOpenDialog({
      title: '选择项目目录',
      properties: ['openDirectory']
    }, (paths) => {
      if (paths.length) {
        openDirectory = paths[0];
        filePath.value = openDirectory;
      }
    });
  }
  run() {
    let status = document.querySelector('#status');
    let filePath = document.querySelector('#filePath');
    const openDirectory = filePath.value.trim();
    if (!openDirectory) {
      status.innerHTML = '目录不能为空！';
      return false;
    }

    this.setState({
      status: ''
    });
    console.log('openDirectory: ', openDirectory);
    console.log('path', path.join(sonarBasePath, scannerFile));
    //let shellCommand = 'cd ' + openDirectory + ' && ' + path.join(appPath, sonarBasePath, scannerFile);

    // 执行 sonar-scanner 分析项目代码命令
    let du = childProcess.spawn(path.join(appPath, sonarBasePath, scannerFile), [openDirectory, path.join(appPath, sonarBasePath)]);
    du.stdout.on('data', (data) => {
      console.log('stdout:', data.toString());
      this.setState({
        status: this.state.status + data.toString() + '\r\n'
      });
    });
    du.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
      this.setState({
        status: this.state.status + data.toString() + '\r\n'
      });
    });
    du.on('error', (err) => {
      console.error('子进程启动失败：', err);
      this.setState({
        status: this.state.status + err + '\r\n'
      });
    });
    du.on('close', (code) => {
      console.log('子进程退出:', code);
      this.setState({
        status: this.state.status + '子进程退出:' + code + '\r\n'
      });
    });

    // 执行 sonar-scanner 分析项目代码命令
    //childProcess.execFile(path.join(appPath, sonarBasePath, scannerFile), [openDirectory, path.join(appPath, sonarBasePath)], null, (err, stdout, stderr) => {
    //  if (err) {
    //    console.error(err);
    //  status.innerHTML = err;
    //    return false;
    //  }
    //  console.log(stdout);
    //  status.innerHTML = stdout;
    //});
  }
  render() {
    let {status} = this.state;
    return (
      <div className="dev_helper_sonar">
        <div className="item">
          <form>
            <label htmlFor="filePath">
              项目目录：
              <input type="input" id="filePath" />
            </label>
            <button type="button" onClick={this.selectProjectDir.bind(this)}>选择项目目录</button>
            <button type="button" onClick={this.run.bind(this)}>开始分析</button>
          </form>
        </div>
        <div className="item info">
          请保证所选目录存在 sonar-project.properties 配置文件
          sonar-project.properties 说明请查看：<a rel="noopener noreferrer" target="_blank" href="http://confluence.chinaso365.com/pages/viewpage.action?pageId=46341791">sonar 使用说明</a>
        </div>
        <pre id="status" className="item">{status}</pre>
      </div>
    );
  }
}

export default Scanner;
