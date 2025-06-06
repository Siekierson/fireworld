# Dokumentacja Techniczna API FireWorld 2.0

## Ogólny opis
API FireWorld 2.0 to RESTful API zbudowane przy użyciu Next.js API routes. Zapewnia endpointy do uwierzytelniania użytkowników, zarządzania postami, wiadomościami, aktywnościami (polubienia i komentarze) oraz funkcjonalność czatu AI. API wykorzystuje tokeny JWT do uwierzytelniania i Supabase jako backend bazy danych.

## Uwierzytelnianie
Wszystkie chronione endpointy wymagają tokenu JWT w nagłówku Authorization:
```http
Authorization: Bearer <token>
```

## Bazowy URL
```http
http://localhost:3000/api
```

## Endpointy

### Uwierzytelnianie (`/api/auth`)

#### Rejestracja Użytkownika
- **Metoda**: POST
- **Ścieżka**: `/api/auth`
- **Body**:
```json
{
  "name": "string",
  "password": "string"
}
```
- **Odpowiedź**: 
  - Sukces (200): Dane rejestracji użytkownika z tokenem
  - Błąd (400): Błąd rejestracji lub brak wymaganych pól

#### Logowanie
- **Metoda**: PUT
- **Ścieżka**: `/api/auth`
- **Body**:
```json
{
  "name": "string",
  "password": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Dane użytkownika z tokenem
  - Błąd (401): Błąd logowania

#### Weryfikacja Tokenu
- **Metoda**: GET
- **Ścieżka**: `/api/auth`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Odpowiedź**:
  - Sukces (200): Dane użytkownika
  - Błąd (401): Nieprawidłowy token

### Posty (`/api/posts`)

#### Utworzenie Posta
- **Metoda**: POST
- **Ścieżka**: `/api/posts`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "text": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Utworzony post
  - Błąd (401): Brak tokenu
  - Błąd (400): Nieprawidłowe dane posta

#### Pobranie Postów
- **Metoda**: GET
- **Ścieżka**: `/api/posts`
- **Parametry zapytania**:
  - `page` (opcjonalny, domyślnie: 1): Numer strony
  - `limit` (opcjonalny, domyślnie: 5): Liczba postów na stronę
- **Odpowiedź**:
  - Sukces (200): Lista postów z danymi użytkowników i aktywnościami
  - Błąd (500): Błąd serwera

#### Usunięcie Posta
- **Metoda**: DELETE
- **Ścieżka**: `/api/posts`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "postID": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Potwierdzenie usunięcia
  - Błąd (401): Brak tokenu
  - Błąd (403): Brak uprawnień
  - Błąd (404): Post nie znaleziony

### Wiadomości (`/api/messages`)

#### Wysłanie Wiadomości
- **Metoda**: POST
- **Ścieżka**: `/api/messages`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "message": "string",
  "toWhoID": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Utworzona wiadomość
  - Błąd (401): Brak tokenu
  - Błąd (400): Brak wymaganych pól

#### Pobranie Wiadomości
- **Metoda**: GET
- **Ścieżka**: `/api/messages`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Parametry zapytania**:
  - `otherUserID`: ID użytkownika, z którym prowadzona jest konwersacja
- **Odpowiedź**:
  - Sukces (200): Lista wiadomości
  - Błąd (401): Brak tokenu
  - Błąd (400): Brak ID użytkownika

### Aktywności (`/api/activity`)

#### Utworzenie Aktywności (Like/Komentarz)
- **Metoda**: POST
- **Ścieżka**: `/api/activity`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "type": "string", // "like" lub "comment"
  "postid": "string",
  "message": "string" // wymagane dla komentarzy
}
```
- **Odpowiedź**:
  - Sukces (200): Utworzona aktywność
  - Błąd (401): Brak tokenu
  - Błąd (400): Brak wymaganych pól

#### Pobranie Aktywności
- **Metoda**: GET
- **Ścieżka**: `/api/activity`
- **Parametry zapytania**:
  - `postID`: ID posta
- **Odpowiedź**:
  - Sukces (200): Lista aktywności z danymi użytkowników
  - Błąd (400): Brak ID posta

#### Usunięcie Aktywności
- **Metoda**: DELETE
- **Ścieżka**: `/api/activity`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "activityID": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Potwierdzenie usunięcia
  - Błąd (401): Brak tokenu
  - Błąd (400): Błąd usuwania

### Użytkownicy (`/api/users`)

#### Pobranie Listy Użytkowników
- **Metoda**: GET
- **Ścieżka**: `/api/users`
- **Nagłówki**: 
```http
Authorization: Bearer <token>
```
- **Odpowiedź**:
  - Sukces (200): Lista użytkowników (bez aktualnie zalogowanego)
  - Błąd (401): Brak tokenu
  - Błąd (400): Błąd pobierania użytkowników

### Chat AI (`/api/chat`)

#### Wysłanie Wiadomości do AI
- **Metoda**: POST
- **Ścieżka**: `/api/chat`
- **Body**:
```json
{
  "message": "string"
}
```
- **Odpowiedź**:
  - Sukces (200): Odpowiedź AI
  - Błąd (500): Błąd przetwarzania żądania

## Obsługa Błędów
Wszystkie endpointy zwracają odpowiednie kody HTTP:
- 200: Sukces
- 400: Błąd w żądaniu
- 401: Brak uwierzytelnienia
- 403: Brak uprawnień
- 404: Nie znaleziono
- 500: Błąd serwera

Każda odpowiedź błędu zawiera obiekt JSON z polem `error` opisującym przyczynę błędu.

## Bezpieczeństwo
- Wszystkie wrażliwe endpointy wymagają tokenu JWT
- Tokeny są weryfikowane przy każdym żądaniu
- Hasła są przechowywane w formie zahaszowanej
- Dostęp do zasobów jest kontrolowany na poziomie użytkownika

## Ograniczenia
- Paginacja postów: domyślnie 5 postów na stronę
- Wiadomości są pobierane dla konkretnej pary użytkowników
- Aktywności są powiązane z konkretnymi postami 