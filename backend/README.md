# Backend Project

## Setup

1.  **Create Virtual Environment:**
    ```bash
    python3 -m venv venv
    ```

    Macos
    ```bash
    source venv/bin/activate
    ```

    Windows
    ```bash
    .\venv\Scripts\Activate.ps1
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Setup:**
    Make sure you have PostgreSQL running and create a database named `blog_db`:
    ```bash
    python -m flask --app src.app init-db
    ```

4.  **Environment Variables:**
    Check `.env` file and update `DB_USER`, `DB_PASSWORD` if necessary.

## Running the App

Run the application from the `backend` directory:

```bash
python -m flask --app src.app run --debug
```


## API Endpoints

-   **Auth:**
    -   `POST /api/auth/register` (Body: email, password, first_name, last_name)
    -   `POST /api/auth/login` (Body: email, password) -> Returns Token

-   **Blogs:**
    -   `GET /api/blogs`
    -   `GET /api/blogs/<id>`
    -   `POST /api/blogs` (Headers: Authorization: Bearer <token>)
    -   `PUT /api/blogs/<id>` (Headers: Authorization: Bearer <token>)
    -   `DELETE /api/blogs/<id>` (Headers: Authorization: Bearer <token>)
