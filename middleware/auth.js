const verifyTelegramWebAppData = async (telegramInitData) => {
  // Дата состоит из наборов пар ключ=<значение>, TelegramInitData - строка, переданная WebApp'ом
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 сигнатура токена бота с константой WebAppData, используемой как ключ.
  const secret = crypto.createHmac("sha256", "WebAppData").update(token);

  // Data-check-string - это цепочка всех полученных значений'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // сортированных в алфавитном порядке
  arr.sort((a, b) => a.localeCompare(b));
  // в формате ключ=<значение> c символом перевода строки ('\n', 0x0A), используемым в качестве резделителя
  // пример: 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // Шестнадцатиричное представление HMAC-SHA-256 сигнатуры data-check-string'a с секретным ключом
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  // Если выявленный хеш совпадает с тем, что предоставлен запросом, аутентифицируем пользователя!
  return _hash === hash;
};

async function auth(req, res, next) {
  const data = req.headers.authorization;
  if (!data) {
    return res.status(401);
  }
  if (verifyTelegramWebAppData(data)) {
    await next();
  } else {
    return res.status(401);
  }
}

module.exports = auth;
