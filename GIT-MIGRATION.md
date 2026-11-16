# Перенесення Git-історії в нову папку DM-System

Цей архів навмисно не містить `.git`, оскільки Git-історія має бути взята з вашого локального репозиторію.

Після розпакування нової папки поруч зі старою виконайте в PowerShell із `cross-platform`:

```powershell
# Переконайтеся, що стара папка ще існує і містить .git
Test-Path .\DM-System-old\.git

# Скопіюйте Git metadata у нову папку
Copy-Item .\DM-System-old\.git .\DM-System\.git -Recurse -Force

# Перевірте історію, гілку та remote
Set-Location .\DM-System
git status
git branch --show-current
git remote -v
git log -5 --oneline
```

Очікувана гілка в наявному локальному репозиторії користувача — `main`; remote раніше був `origin`.

Не виконуйте `git init`, `git remote add`, `git reset --hard` або `git clean` під час перенесення. Не видаляйте стару папку, доки перевірки не завершено.

Після копіювання `.git` перевірте `git status`. Нові та змінені файли потрібно переглянути перед `git add` і commit.

## Локальні секрети

Архів не містить `.env`. Відновіть власні локальні `.env` із безпечної копії, використовуючи відповідні `.env.example`. Не додавайте секрети до Git.
