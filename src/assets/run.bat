echo %1% %2%
pushd %current_dir%
echo %cd%
call %2%\sonar-scanner-2.8\bin\sonar-scanner.bat
