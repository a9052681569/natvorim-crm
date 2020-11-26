import { writeFile, readFileSync } from 'fs';

// массив аргументов переданных при вызове скрипта
const activateStubFor = process.argv.slice(2);

// возможные ключи, для переключения на стабы
const stubKeys = JSON.parse(readFileSync('./src/stub-config-keys.json', 'utf8'));

// динамически генерируемый стаб конфиг
const dynamicStubConfig = {};

// проходим по всем ключам изменяя значения динамически генерируемого конфига
// в зависимости от переданных в скрипт аргументов
stubKeys.forEach((key: string) => {
	dynamicStubConfig[key] = activateStubFor.includes(key);
});

// путь к перезаписываемому файлу
const targetPath = './src/environments/dynamic-stub-config.ts';

// наполнение перезаписываемого файла
const envConfigFile = `export const dynamicStubConfig = ${JSON.stringify(dynamicStubConfig)};`;

// перезаписывает файл нужным заполнением и отчитывается при успехе или ошибке
writeFile(targetPath, envConfigFile, (err: any) => {
	if (err) {
		throw console.error(err);
	} else {
		console.log('успешно изменили stubConfig');
	}
});
