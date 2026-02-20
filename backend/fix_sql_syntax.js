const fs = require('fs');
const path = require('path');

// Mendukung input file sebagai argumen: node fix_sql_syntax.js [input.sql]
const inputArg = process.argv[2];
const inputFile = inputArg
    ? path.resolve(process.cwd(), inputArg)
    : path.join(__dirname, 'dump.sql');

const baseName = path.basename(inputFile, path.extname(inputFile));
const outputFile = path.join(path.dirname(inputFile), `fixed_${baseName}.sql`);

if (!fs.existsSync(inputFile)) {
    console.error(`Error: File '${inputFile}' tidak ditemukan.`);
    process.exit(1);
}

let content = fs.readFileSync(inputFile, 'utf8');

// 1. Ganti backtick `identifier` menjadi [identifier]
content = content.replace(/`([^`]*)`/g, '[$1]');

// 2. Ganti escaped single quotes (\') menjadi double single quotes ('')
content = content.replace(/\\'/g, "''");

// 3. Ganti int(11) dll menjadi int
content = content.replace(/int\(\d+\)/gi, 'int');

// 3b. Ganti DOUBLE (MySQL) menjadi DECIMAL(18,6) (T-SQL)
content = content.replace(/\bDOUBLE\b/gi, 'DECIMAL(18,6)');

// 4. Upgrade kolom *_ENG dan *_ID: VARCHAR(512) -> VARCHAR(MAX)
content = content.replace(/(\[DETAIL_ENG\]\s+)VARCHAR\(512\)/gi, '$1VARCHAR(MAX)');
content = content.replace(/(\[DETAIL_ID\]\s+)VARCHAR\(512\)/gi, '$1VARCHAR(MAX)');

// 5. Tambahkan DROP TABLE IF EXISTS untuk setiap CREATE TABLE yang ditemukan
content = content.replace(/CREATE TABLE (\[[\w]+\]|\w+)/gi, (match, tableName) => {
    const cleanName = tableName.replace(/[\[\]]/g, '');
    return `IF OBJECT_ID('dbo.${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName};\nGO\n\n${match}`;
});

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`✅ Berhasil! File tersimpan di: ${outputFile}`);
