npm run build
pause
winscp.exe annaniks /keepuptodate "C:\Users\Annaniks\Desktop\reactProject\employee\build" /var/www/shemm /defaults
pause
plink -ssh root@46.101.179.50 -pw LCto6XSk "sudo service nginx restart"