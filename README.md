# Stowarzyszenie Lubawczanie – strona WWW

Next.js 15 / React 19 / Supabase. Interfejs w PL, CS, DE, EN. Strona jest responsywna, zawiera slider czterech autentycznych zdjęć, aktualności, projekty, misję, zarząd, dokumenty, członkostwo, darowizny i kontakt. CMS pozwala tworzyć, edytować, publikować i usuwać aktualności oraz projekty, wprowadzać tłumaczenia i dodawać zdjęcia. Pozostałe teksty edytuje się w `lib/content.js` i `app/page.jsx`.

## 1. Uruchomienie lokalne

Wymagany Node.js 22 (lub kompatybilna wersja LTS). Rozpakuj ZIP, otwórz terminal w katalogu `lubawczanie-www`:

```sh
npm install
npm run dev
```

Otwórz http://localhost:3000. Bez Supabase strona korzysta z `lib/seed.json`, a panel `/admin` pokazuje instrukcję konfiguracji. Przed publikacją wykonaj `npm run build`.

## 2. Supabase (jednorazowo)

1. Utwórz projekt Supabase, najlepiej w regionie UE. W SQL Editor wykonaj **raz** `supabase/schema.sql` (tworzy tabele, polityki RLS, magazyn obrazów i siedem wpisów startowych).
2. Authentication → Users → Add user. Utwórz konto administratora z silnym hasłem i potwierdzonym adresem e-mail. Wyłącz publiczną rejestrację użytkowników w ustawieniach Auth. Skopiuj UUID tego konta.
3. W SQL Editor wykonaj poniższą instrukcję, zamieniając wartość na rzeczywisty UUID:

```sql
insert into public.admins (user_id) values ('TU-UUID-UZYTKOWNIKA');
```

4. Skopiuj `.env.example` do `.env.local`. Uzupełnij URL projektu oraz klucz anon/public (może być publishable key, jeśli projekt używa nowego formatu). NIE używaj service_role ani secret key.

```env
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-klucz-publiczny
```

5. Uruchom ponownie serwer. Zaloguj się na `/admin`. Wpisy opublikowane są widoczne publicznie; szkice tylko dla administratorów. Uprawnienia są sprawdzane w bazie, nie tylko w interfejsie. Zdjęcia w magazynie mają publiczny adres, nie przesyłaj tam danych poufnych. Usunięcie wpisu nie usuwa automatycznie pliku zdjęcia; zbędne pliki usuń ręcznie z panelu Storage.

## 3. Vercel i domena

1. Załóż repozytorium Git i wgraj zawartość projektu (bez `.env.local`, `node_modules`, `.next`).
2. W Vercel wybierz Add New → Project, zaimportuj repozytorium. Framework Next.js.
3. Ustaw oba klucze `NEXT_PUBLIC_...` w Settings → Environment Variables dla odpowiednich środowisk. Deploy.
4. W Settings → Domains dodaj `lubawczanie.pl` i `www.lubawczanie.pl`. Zastosuj dokładne rekordy DNS wskazane przez Vercel u operatora domeny. Nie zmieniaj rekordów pocztowych MX/TXT. Ustaw przekierowanie na preferowaną domenę.
5. Sprawdź stronę i CMS, przetestuj publikację szkicu, zmianę języka, slider, pobieranie dokumentów i widok mobilny.

## 4. Materiały i decyzje przed publikacją

- Dane rejestrowe, statut i deklaracja pochodzą z dostarczonych dokumentów, dane kontaktowe i zarząd z informacji użytkownika. Dokumenty w oryginalnym DOCX, bez tłumaczeń.
- Opisy EkoLubawczanie, LEADER oraz Toyota opracowano z dostarczonego artykułu i zrzutów postów. Daty nieznane pozostawiono puste. Mindfulness ma krótki opis, do rozszerzenia na podstawie dokumentacji projektu. Źródło Eko: https://id-24.pl/31322-2/ . Facebook: https://www.facebook.com/StowarzyszenieLubawczanie . Nie importowano pełnego archiwum Facebooka.
- Zdjęcia projektów i logotypy grantodawców należy dodać po potwierdzeniu praw do publikacji i wymogów oznakowania. W kartach bez zdjęcia pokazano ilustracyjne symbole, nie fikcyjne fotografie. Zdjęcia miasta pochodzą z przesłanych plików; potwierdź prawa do ich publikacji.
- Tłumaczenia są roboczymi tłumaczeniami redakcyjnymi, do sprawdzenia przez osoby znające języki. Nazwy własne i dokumenty zachowano w oryginale. Przełącznik języka używa parametru `?lang=cs` itd.; podstrony wpisów działają przez adresy z hashem. Nie wdrożono osobnych indeksowalnych tras SEO dla języków i artykułów.
- Kontakt i wstępne zgłoszenie członkowskie odbywają się przez link e-mail i dokument do pobrania, bez gromadzenia danych osobowych w publicznej bazie. Nie ma serwerowego formularza kontaktowego ani automatycznego przyjmowania członków. Zgodnie ze statutem wymagana jest pisemna deklaracja, rekomendacja dwóch członków i uchwała zarządu.
- Polityka prywatności to wersja robocza. Uzupełnij informacje o hostingu, Supabase, logach, podstawach prawnych i okresach przechowywania odpowiednio do rzeczywistego wdrożenia. Brak zewnętrznych trackerów i osadzonych map.
- Przed uruchomieniem sprawdź rachunek bankowy, dane kontaktowe i statusy projektów. Nie dodano podpisu wykonawcy bez wyraźnej akceptacji.
- Podstawowe rozwiązania dostępności: nawigacja klawiaturą, focus, skip link, pauza slidera, ograniczenie animacji, responsywność. Nie zastępuje to audytu WCAG.
