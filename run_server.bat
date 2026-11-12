@echo off
rem 唯一站点：PRISM（中英双语，页面内右上角切换），http://localhost:4000
rem 改 content\ 或 content_zh\ 后刷新浏览器即可生效，无需重启。
rem 要核对线上部署产物，另外执行： npm run build && npx --yes serve out -l 4000
cd /d "%~dp0PRISM"
call npm install --no-audit --no-fund
call npm run dev -- -p 4000
