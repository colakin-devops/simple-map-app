ssh ubuntu@168.138.14.11 << 'EOF'
sudo git -C /mnt/data/ffg/maps/services/ checkout -- .
sudo git -C /mnt/data/ffg/maps/services/ pull

# Copy systemd service file (assuming it's in the repo root)
sudo cp /mnt/data/ffg/maps/services/simple-map-app.service /etc/systemd/system/
sudo systemctl daemon-reload

# Restart the service
sudo systemctl enable simple-map-app
sudo systemctl restart simple-map-app

# Optional: Disable PM2 if it's still running
# pm2 stop all && pm2 delete all
EOF

