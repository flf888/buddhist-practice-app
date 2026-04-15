#!/bin/bash
APP_DIR=/data/www/buddhist-app
echo deploy started

# 备份数据库文件
DB_FILE=$APP_DIR/server/src/buddhist.json
if [ -f "$DB_FILE" ]; then
  cp "$DB_FILE" /tmp/buddhist.json.bak
  echo "数据库已备份（含 $(cat "$DB_FILE" | python3 -c "import sys,json;d=json.load(sys.stdin);print(len(d.get('users',[])),'用户,',len(d.get('practice_records',[])),'记录')" 2>/dev/null || echo '数据')）"
fi

cd $APP_DIR
npm install --registry=https://registry.npmmirror.com --silent
npm run build
cd server && npm install --registry=https://registry.npmmirror.com --silent && cd ..

# 恢复数据库文件
if [ -f /tmp/buddhist.json.bak ]; then
  cp /tmp/buddhist.json.bak "$DB_FILE"
  echo "数据库已恢复"
fi

pm2 restart buddhist-app
/opt/app/nginx/sbin/nginx -s reload
echo done: http://220.168.41.37
