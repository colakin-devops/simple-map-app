ssh ubuntu@168.138.14.11 << 'EOF'
cd /mnt/data/ffg/maps/services/ || exit 1
sudo git checkout -- .
sudo git pull
pm2 restart 0
EOF
