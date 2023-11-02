
echo Installing NestJS dependencies...

cd /d %~dp0

echo %cd%



npm install --save @nestjs/typeorm typeorm mysql2 @nestjs/jwt class-validator class-transformer redis

echo NestJS dependencies installed successfully.
pause